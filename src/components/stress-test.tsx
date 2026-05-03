"use client";

import { useState } from "react";
import { Flame, TrendingDown, Activity, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { runStressTest } from "@/lib/stress-test";
import { CRISIS_SCENARIOS } from "@/lib/scenarios";
import type { ScenarioId, Sektor, UserProfile, StressTestResult } from "@/types";

const SEKTORS: Sektor[] = [
  "Digital/Tech",
  "Finansial/Banking",
  "Pariwisata/F&B",
  "Manufaktur/Ekspor",
  "Pemerintahan",
  "Lainnya",
];

const DEFAULT_PROFILE: UserProfile = {
  income: 10_000_000,
  expenses: {
    cicilan: 2_000_000,
    pokok: 3_000_000,
    utilities: 800_000,
    subscription: 300_000,
    lifestyle: 1_500_000,
    healing: 500_000,
  },
  savings: {
    rupiah: 20_000_000,
    usd: 0,
    emas: 5_000_000,
    invest: 10_000_000,
  },
  sektor: "Digital/Tech",
  cicilanFloating: true,
};

export function StressTest() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [result, setResult] = useState<StressTestResult | null>(null);
  const [actionTab, setActionTab] = useState<"quick" | "medium" | "long">("quick");

  const handleRun = (id: ScenarioId) => {
    setScenario(id);
    const r = runStressTest(id, profile);
    setResult(r);
    // Scroll ke hasil
    setTimeout(() => {
      document.getElementById("stress-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const totalExpense = Object.values(profile.expenses).reduce((a, b) => a + b, 0);
  const totalSavings = Object.values(profile.savings).reduce((a, b) => a + b, 0);
  const cashflow = profile.income - totalExpense;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">🧪 Budget Stress Test</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Simulasiin ketahanan finansial lo dalam skenario krisis historis Indonesia.
        </p>
      </div>

      {/* Form */}
      <div className="premium-card p-6 animate-in">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">📝</span>
          <h3 className="text-base font-semibold font-display">Step 1 — Input Data Finansial Lo</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Income & Expenses */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">💰 Income & Pengeluaran</h4>

            <NumberInput
              label="Income bulanan"
              value={profile.income}
              onChange={(v) => setProfile({ ...profile, income: v })}
            />

            <p className="text-xs font-medium text-muted-foreground pt-2">Pengeluaran (per kategori):</p>

            {([
              ["cicilan", "Cicilan (KPR, KTA, paylater)"],
              ["pokok", "Kebutuhan pokok (makan, transport)"],
              ["utilities", "Utilitas (listrik, internet, pulsa)"],
              ["subscription", "Subscription (Spotify, Netflix, dll)"],
              ["lifestyle", "Lifestyle (nongkrong, fashion)"],
              ["healing", "Healing (travel, konser, hobi)"],
            ] as const).map(([key, label]) => (
              <NumberInput
                key={key}
                label={label}
                value={profile.expenses[key]}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    expenses: { ...profile.expenses, [key]: v },
                  })
                }
                small
              />
            ))}
          </div>

          {/* Assets & Sector */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">💎 Aset & Tabungan</h4>

            {([
              ["rupiah", "Tabungan rupiah"],
              ["usd", "Tabungan USD/dolar (Rp ekuivalen)"],
              ["emas", "Emas (Rp ekuivalen)"],
              ["invest", "Reksadana / saham"],
            ] as const).map(([key, label]) => (
              <NumberInput
                key={key}
                label={label}
                value={profile.savings[key]}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    savings: { ...profile.savings, [key]: v },
                  })
                }
                small
              />
            ))}

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">🏢 Sektor Pekerjaan</h4>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                value={profile.sektor}
                onChange={(e) => setProfile({ ...profile, sektor: e.target.value as Sektor })}
              >
                {SEKTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-semibold text-foreground mb-2">📈 Tipe Cicilan</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!profile.cicilanFloating}
                    onChange={() => setProfile({ ...profile, cicilanFloating: false })}
                    className="text-brand focus:ring-brand"
                  />
                  <span className="text-sm">Fixed (tetap)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={profile.cicilanFloating}
                    onChange={() => setProfile({ ...profile, cicilanFloating: true })}
                    className="text-brand focus:ring-brand"
                  />
                  <span className="text-sm">Floating (mengikuti BI Rate)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200">
          <SummaryStat label="Total Pengeluaran" value={formatRupiah(totalExpense)} />
          <SummaryStat
            label="Cashflow Bulanan"
            value={`${cashflow >= 0 ? "+" : ""}${formatRupiah(cashflow)}`}
            color={cashflow >= 0 ? "green" : "red"}
          />
          <SummaryStat label="Total Aset Likuid" value={formatRupiah(totalSavings)} />
        </div>
      </div>

      {/* Scenario picker */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⚡</span>
          <h3 className="text-base font-semibold font-display">Step 2 — Pilih Skenario Krisis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScenarioCard
            id="1998"
            emoji="🔥"
            title="Krisis Asia 1998"
            severity={5}
            desc="Rupiah jeblok 540%, inflasi 77%, PHK massal, bank kolaps"
            isSelected={scenario === "1998"}
            onClick={() => handleRun("1998")}
          />
          <ScenarioCard
            id="2008"
            emoji="📉"
            title="GFC 2008"
            severity={3}
            desc="Rupiah lemah 30%, IHSG -50%, sektor finansial terdampak"
            isSelected={scenario === "2008"}
            onClick={() => handleRun("2008")}
          />
          <ScenarioCard
            id="2020"
            emoji="🦠"
            title="Pandemic 2020"
            severity={4}
            desc="Resesi -2%, pengangguran 7%, pariwisata kolaps"
            isSelected={scenario === "2020"}
            onClick={() => handleRun("2020")}
          />
        </div>
      </div>

      {/* Result */}
      {result && scenario && (
        <div id="stress-result" className="space-y-6 animate-in">
          <ResultBanner result={result} scenarioName={CRISIS_SCENARIOS[scenario].name} />

          {/* Breakdown tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreakdownTable title="💸 Pengeluaran" data={result.expenseBreakdown} />
            <BreakdownTable title="💎 Aset (Purchasing Power)" data={result.savingsBreakdown} />
          </div>

          {/* Risks */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="text-base font-semibold font-display">Risk Highlights</h3>
            </div>
            <div className="space-y-2">
              {result.risks.map((risk, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border p-3 text-sm leading-relaxed",
                    risk.includes("✅")
                      ? "bg-success-bg border-success/20 text-success-fg"
                      : "bg-danger-bg border-danger/20 text-danger-fg"
                  )}
                  dangerouslySetInnerHTML={{ __html: risk.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                />
              ))}
            </div>
          </div>

          {/* Action plan */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-brand" />
              <h3 className="text-base font-semibold font-display">Action Plan Buat Lo</h3>
            </div>
            <div className="flex gap-1 border-b border-slate-200 mb-4">
              {([
                ["quick", "Quick Wins (minggu ini)"],
                ["medium", "Medium-term (1-3 bulan)"],
                ["long", "Long-term (3-12 bulan)"],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setActionTab(k)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
                    actionTab === k
                      ? "border-brand text-brand"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <ul className="space-y-2 text-sm leading-relaxed">
              {result.actions[actionTab].map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Story */}
          <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Cerita Krisis Ini
              </p>
            </div>
            <p className="text-sm leading-relaxed text-blue-900">
              {CRISIS_SCENARIOS[scenario].story}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function NumberInput({
  label, value, onChange, small = false,
}: {
  label: string; value: number; onChange: (v: number) => void; small?: boolean;
}) {
  return (
    <div>
      <label className={cn("block font-medium text-foreground mb-1", small ? "text-xs" : "text-sm")}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
          Rp
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all tabular-nums"
        />
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }: { label: string; value: string; color?: "green" | "red" }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn(
        "text-lg font-bold font-display tabular-nums mt-1",
        color === "green" && "text-success-fg",
        color === "red" && "text-danger-fg"
      )}>
        {value}
      </p>
    </div>
  );
}

function ScenarioCard({
  id, emoji, title, severity, desc, isSelected, onClick,
}: {
  id: ScenarioId; emoji: string; title: string; severity: number; desc: string;
  isSelected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "premium-card p-5 text-left transition-all hover:scale-[1.02] hover:shadow-md",
        isSelected && "ring-2 ring-brand bg-brand/5"
      )}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="font-semibold text-base font-display mb-1">{title}</h4>
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn("w-2 h-2 rounded-full", i < severity ? "bg-foreground" : "bg-slate-200")}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{desc}</p>
      <div className={cn(
        "text-xs font-medium",
        isSelected ? "text-brand" : "text-muted-foreground"
      )}>
        {isSelected ? "✓ Dipilih" : "Klik untuk run →"}
      </div>
    </button>
  );
}

function ResultBanner({ result, scenarioName }: { result: StressTestResult; scenarioName: string }) {
  const survival = result.survivalMonths;
  const status =
    survival >= 12
      ? { emoji: "🟢", label: "Aman", color: "green" }
      : survival >= 6
      ? { emoji: "🟡", label: "Cukup", color: "yellow" }
      : survival >= 3
      ? { emoji: "🟠", label: "Risky", color: "orange" }
      : { emoji: "🔴", label: "Bahaya", color: "red" };

  return (
    <div className={cn(
      "rounded-2xl border-2 p-6 bg-gradient-to-br",
      status.color === "green" && "border-success bg-success-bg from-success/10 to-transparent",
      status.color === "yellow" && "border-warning bg-warning-bg from-warning/10 to-transparent",
      status.color === "orange" && "border-orange-400 bg-orange-50 from-orange-100 to-transparent",
      status.color === "red" && "border-danger bg-danger-bg from-danger/10 to-transparent",
    )}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
        Hasil Stress Test: {scenarioName}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Survival Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-display tabular-nums">
              {status.emoji} {survival.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">bulan</span>
          </div>
          <p className={cn(
            "text-sm font-semibold mt-2",
            status.color === "green" && "text-success-fg",
            status.color === "yellow" && "text-warning-fg",
            status.color === "orange" && "text-orange-700",
            status.color === "red" && "text-danger-fg",
          )}>
            Status: {status.label}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Cashflow Berubah</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sebelum krisis:</span>
            <span className={cn("font-semibold tabular-nums", result.cashflowBefore >= 0 ? "text-success-fg" : "text-danger-fg")}>
              {result.cashflowBefore >= 0 ? "+" : ""}{formatRupiah(result.cashflowBefore)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
            <span className="text-muted-foreground">Saat krisis:</span>
            <span className={cn("font-semibold tabular-nums", result.cashflowAfter >= 0 ? "text-success-fg" : "text-danger-fg")}>
              {result.cashflowAfter >= 0 ? "+" : ""}{formatRupiah(result.cashflowAfter)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownTable({ title, data }: { title: string; data: Record<string, { before: number; after: number; changePct: number }> }) {
  return (
    <div className="premium-card p-6">
      <h3 className="text-base font-semibold font-display mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-2">Kategori</th>
              <th className="text-right py-2">Sebelum</th>
              <th className="text-right py-2">Sesudah</th>
              <th className="text-right py-2">Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(data).map(([k, v]) => (
              <tr key={k}>
                <td className="py-2 text-foreground">{k}</td>
                <td className="text-right py-2 tabular-nums text-muted-foreground">{formatRupiah(v.before)}</td>
                <td className="text-right py-2 tabular-nums font-medium">{formatRupiah(v.after)}</td>
                <td className={cn(
                  "text-right py-2 tabular-nums font-semibold",
                  v.changePct > 0 && "text-danger-fg",
                  v.changePct < 0 && "text-success-fg",
                  v.changePct === 0 && "text-muted-foreground"
                )}>
                  {v.changePct > 0 ? "+" : ""}{v.changePct.toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
