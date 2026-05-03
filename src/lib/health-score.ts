// ============================================================
// Health Score Calculator
// ============================================================

import type { MacroData, HealthScore } from "@/types";

export const APBN_2026 = {
  kurs: 16500,
  growth: 5.4,
  inflation: 2.5,
  yield10y: 6.9,
  icp: 70,
};

export function calculateHealthScore(data: MacroData): HealthScore {
  const scores: Record<string, number> = {};

  // USD/IDR vs APBN
  const deviation = (data.usdIdr.value - data.usdIdr.benchmark) / data.usdIdr.benchmark;
  if (deviation < 0.02) scores.usdIdr = 100;
  else if (deviation < 0.035) scores.usdIdr = 70;
  else if (deviation < 0.05) scores.usdIdr = 45;
  else scores.usdIdr = 25;

  // Cadev
  if (data.cadev.monthsImport >= 6) {
    scores.cadev = data.cadev.change > 0 ? 80 : 65;
  } else if (data.cadev.monthsImport >= 3) {
    scores.cadev = 50;
  } else {
    scores.cadev = 20;
  }

  // Inflasi (target 2.5% ±1%)
  const inf = data.inflation.value;
  if (inf >= 1.5 && inf <= 3.5) scores.inflation = 100;
  else if (inf < 5) scores.inflation = 70;
  else scores.inflation = 40;

  // GDP
  const gdp = data.gdp.value;
  if (gdp >= 5) scores.gdp = 100;
  else if (gdp >= 3) scores.gdp = 70;
  else scores.gdp = 40;

  // Yield 10Y
  const y = data.yield10y.value;
  if (y < 7) scores.yield = 90;
  else if (y < 8.5) scores.yield = 60;
  else scores.yield = 30;

  // PMI
  if (data.pmi.value >= 50) scores.pmi = 100;
  else if (data.pmi.value >= 48) scores.pmi = 60;
  else scores.pmi = 30;

  // Trade Balance
  const tb = data.tradeBalance.value;
  if (tb > 1) scores.trade = 100;
  else if (tb > 0) scores.trade = 70;
  else scores.trade = 40;

  // BI Rate stance (gap dengan Fed)
  const biFedGap = data.biRate.value - data.fedRate;
  if (biFedGap >= 1.5) scores.biStance = 90;
  else if (biFedGap >= 0.5) scores.biStance = 70;
  else scores.biStance = 40;

  const weights = {
    usdIdr: 0.2,
    cadev: 0.15,
    inflation: 0.15,
    gdp: 0.15,
    yield: 0.1,
    pmi: 0.1,
    trade: 0.1,
    biStance: 0.05,
  };

  const totalScore = Math.round(
    Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + (scores[key] || 0) * weight,
      0
    )
  );

  let status: string;
  let color: HealthScore["color"];

  if (totalScore >= 80) {
    status = "Sehat";
    color = "green";
  } else if (totalScore >= 60) {
    status = "Waspada";
    color = "yellow";
  } else if (totalScore >= 40) {
    status = "Berisiko";
    color = "orange";
  } else {
    status = "Kritis";
    color = "red";
  }

  return { score: totalScore, status, color };
}
