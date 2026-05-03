// ============================================================
// Stress Test Logic — port dari scenarios.py
// ============================================================

import type {
  ScenarioId,
  UserProfile,
  StressTestResult,
  BreakdownItem,
} from "@/types";
import { CRISIS_SCENARIOS } from "./scenarios";

export function runStressTest(
  scenarioId: ScenarioId,
  profile: UserProfile
): StressTestResult {
  const scenario = CRISIS_SCENARIOS[scenarioId];
  const { income, expenses, savings, sektor, cicilanFloating } = profile;

  // Income setelah krisis
  const incomeMultiplier = scenario.incomeImpact[sektor] ?? 0.7;
  const incomeAfter = Math.round(income * incomeMultiplier);

  // Expense setelah krisis
  const cicilanMult = cicilanFloating
    ? scenario.expenseMultiplier.cicilanFloating
    : scenario.expenseMultiplier.cicilanFixed;

  const buildItem = (before: number, mult: number): BreakdownItem => ({
    before,
    after: Math.round(before * mult),
    changePct: (mult - 1) * 100,
  });

  const expenseBreakdown: Record<string, BreakdownItem> = {
    Cicilan: buildItem(expenses.cicilan, cicilanMult),
    Pokok: buildItem(expenses.pokok, scenario.expenseMultiplier.pokok),
    Utilities: buildItem(expenses.utilities, scenario.expenseMultiplier.utilities),
    Subscription: buildItem(
      expenses.subscription,
      scenario.expenseMultiplier.subscription
    ),
    Lifestyle: buildItem(expenses.lifestyle, scenario.expenseMultiplier.lifestyle),
    Healing: buildItem(expenses.healing, scenario.expenseMultiplier.healing),
  };

  const expenseBefore = Object.values(expenseBreakdown).reduce(
    (sum, x) => sum + x.before,
    0
  );
  const expenseAfter = Object.values(expenseBreakdown).reduce(
    (sum, x) => sum + x.after,
    0
  );

  // Aset setelah krisis
  const savingsBreakdown: Record<string, BreakdownItem> = {
    "Tabungan Rupiah (purchasing power)": buildItem(
      savings.rupiah,
      scenario.assetImpact.rupiah
    ),
    "Tabungan USD": buildItem(savings.usd, scenario.assetImpact.usd),
    Emas: buildItem(savings.emas, scenario.assetImpact.emas),
    "Reksadana/Saham": buildItem(savings.invest, scenario.assetImpact.invest),
  };

  const totalSavingsAfter = Object.values(savingsBreakdown).reduce(
    (sum, x) => sum + x.after,
    0
  );

  // Survival months
  const cashflowBefore = income - expenseBefore;
  const cashflowAfter = incomeAfter - expenseAfter;

  let survivalMonths: number;
  if (cashflowAfter >= 0) {
    survivalMonths = 999;
  } else {
    const deficit = Math.abs(cashflowAfter);
    survivalMonths = deficit > 0 ? totalSavingsAfter / deficit : 999;
  }
  const survivalDisplay = Math.min(survivalMonths, 24);

  // Identifikasi risiko
  const risks: string[] = [];

  const totalSavingsBefore =
    savings.rupiah + savings.usd + savings.emas + savings.invest;
  const rupiahPct =
    totalSavingsBefore > 0 ? (savings.rupiah / totalSavingsBefore) * 100 : 0;

  if (rupiahPct > 70) {
    risks.push(
      `⚠️ **Tabungan lo ${rupiahPct.toFixed(0)}% rupiah** — di krisis 98 daya belinya turun 75%. Pertimbangkan diversifikasi ke USD/emas (10-30%).`
    );
  }

  const cicilanRatio = income > 0 ? (expenses.cicilan / income) * 100 : 0;
  if (cicilanRatio > 30) {
    risks.push(
      `⚠️ **Cicilan lo ${cicilanRatio.toFixed(0)}% dari income** — di atas safe limit (30%). Risk tinggi kalo BI Rate naik atau income drop.`
    );
  }

  if (cicilanFloating && expenses.cicilan > 0) {
    risks.push(
      `⚠️ **Cicilan lo floating rate** — di krisis, suku bunga bisa naik drastis. Pertimbangkan refinance ke fixed rate.`
    );
  }

  if (incomeMultiplier < 0.7) {
    risks.push(
      `⚠️ **Sektor lo (${sektor})** historically terdampak parah di skenario ini. Income bisa drop ke ${Math.round(incomeMultiplier * 100)}% dari sekarang.`
    );
  }

  if (savings.rupiah + savings.usd < expenseBefore * 6) {
    risks.push(
      `⚠️ **Dana darurat lo kurang dari 6x pengeluaran bulanan.** Standard rule of thumb buat ketahanan krisis.`
    );
  }

  const discretionary = expenses.lifestyle + expenses.healing;
  if (income > 0 && discretionary > income * 0.3) {
    risks.push(
      `⚠️ **Pengeluaran lifestyle + healing ${((discretionary / income) * 100).toFixed(0)}% dari income.** Di krisis, ini area pertama yang harus di-cut.`
    );
  }

  if (risks.length === 0) {
    risks.push(`✅ **Profil finansial lo cukup resilient!** Tetep monitor & tingkatkan terus.`);
  }

  // Action plan
  const actions = {
    quick: [] as string[],
    medium: [] as string[],
    long: [] as string[],
  };

  if (expenses.subscription > 200_000) {
    actions.quick.push(
      `Audit subscription lo (Rp ${expenses.subscription.toLocaleString("id-ID")}/bulan). Cancel yang ga essential, hemat 30-50%.`
    );
  }
  if (expenses.healing > 500_000) {
    actions.quick.push(
      "Defer 1-2 healing trip dulu, alokasiin ke dana darurat."
    );
  }
  actions.quick.push("Pisahkan rekening dana darurat dari rekening utama.");
  actions.quick.push("Track pengeluaran harian seminggu — biasanya nemu leakage Rp 500rb-1jt/bulan.");

  const neededEmergency = expenseBefore * 6;
  const currentEmergency = savings.rupiah + savings.usd;
  if (currentEmergency < neededEmergency) {
    const gap = neededEmergency - currentEmergency;
    actions.medium.push(
      `Build dana darurat sampai Rp ${Math.round(neededEmergency).toLocaleString("id-ID")} (6x pengeluaran). Lo masih kurang Rp ${Math.round(gap).toLocaleString("id-ID")}.`
    );
  }
  if (savings.usd === 0 && totalSavingsAfter > 0) {
    actions.medium.push(
      "Mulai diversifikasi: alokasiin 10-20% tabungan ke USD/emas/SBN sebagai hedge."
    );
  }
  if (expenses.cicilan > 0) {
    actions.medium.push(
      "Lunasin paylater & utang konsumtif kecil dulu (debt snowball). Kurangi cashflow burden."
    );
  }
  actions.medium.push("Cari side income — minimal 1 sumber tambahan biar ga full reliant.");

  actions.long.push("Build skill yang resilient terhadap krisis (tech, sales, kesehatan, digital marketing).");
  actions.long.push("Invest in long-term assets: properti produktif, saham blue-chip, atau bisnis sendiri.");
  actions.long.push(
    `Naikkan emergency fund target ke 12x pengeluaran (Rp ${Math.round(expenseBefore * 12).toLocaleString("id-ID")}).`
  );
  actions.long.push("Build network di industri lo — di krisis, network = peluang kerja.");

  return {
    survivalMonths: survivalDisplay,
    cashflowBefore,
    cashflowAfter,
    incomeAfter,
    expenseAfter,
    expenseBreakdown,
    savingsBreakdown,
    risks,
    actions,
  };
}
