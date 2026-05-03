// ============================================================
// Dynamic Insight Generator
// Generate insight messages berdasarkan kondisi indicator
// ============================================================

import type { MacroData } from "@/types";

export interface Insight {
  type: "warning" | "info" | "success" | "danger";
  title: string;
  message: string;
}

export function generateInsights(data: MacroData): Insight[] {
  const insights: Insight[] = [];

  // ========== INSIGHT 1: USD/IDR vs APBN ==========
  const kursDiff = data.usdIdr.value - data.usdIdr.benchmark;
  const kursDiffPct = (kursDiff / data.usdIdr.benchmark) * 100;
  const importImpactPct = Math.abs(kursDiffPct * 1.2); // proxy: tiap 1% kurs lemah ≈ 1.2% inflasi impor

  if (kursDiff > 500) {
    insights.push({
      type: "warning",
      title: "Rupiah tertekan",
      message: `Rupiah lemah Rp${kursDiff.toLocaleString("id-ID")} dari asumsi APBN (${kursDiffPct.toFixed(1)}%). Barang impor lo bisa naik ~${importImpactPct.toFixed(1)}%.`,
    });
  } else if (kursDiff > 0) {
    insights.push({
      type: "info",
      title: "Rupiah sedikit melemah",
      message: `Rupiah lemah Rp${kursDiff.toLocaleString("id-ID")} dari APBN — masih dalam toleransi normal.`,
    });
  } else {
    insights.push({
      type: "success",
      title: "Rupiah stabil",
      message: `Rupiah ${kursDiff < 0 ? `lebih kuat Rp${Math.abs(kursDiff).toLocaleString("id-ID")}` : "sesuai"} dari asumsi APBN. Kondisi sehat buat impor & investor.`,
    });
  }

  // ========== INSIGHT 2: Cadangan Devisa ==========
  if (data.cadev.change < -2) {
    const yearlyDrain = Math.abs(data.cadev.change * 12);
    const yearlyDrainRupiah = Math.round(yearlyDrain * data.usdIdr.value);
    insights.push({
      type: "warning",
      title: "Cadev tergerus",
      message: `Cadev turun $${Math.abs(data.cadev.change).toFixed(1)}M bulan ini. Annualized: ~$${yearlyDrain.toFixed(1)}M (≈Rp${(yearlyDrainRupiah / 1000).toFixed(0)}T) dipake BI buat tahan rupiah. Cover ${data.cadev.monthsImport} bulan impor.`,
    });
  } else if (data.cadev.change < 0) {
    insights.push({
      type: "info",
      title: "Cadev sedikit turun",
      message: `Cadev turun $${Math.abs(data.cadev.change).toFixed(1)}M MoM, tapi masih cover ${data.cadev.monthsImport} bulan impor — di atas standar aman 3 bulan.`,
    });
  } else {
    insights.push({
      type: "success",
      title: "Cadev sehat",
      message: `Cadev di $${data.cadev.value}M — naik $${data.cadev.change.toFixed(1)}M MoM. Cover ${data.cadev.monthsImport} bulan impor. Posisi kuat.`,
    });
  }

  // ========== INSIGHT 3: Inflasi vs Target BI ==========
  const inflationGap = data.inflation.value - 2.5; // target BI tengah
  if (data.inflation.value > 4) {
    insights.push({
      type: "danger",
      title: "Inflasi di atas target",
      message: `Inflasi ${data.inflation.value.toFixed(2)}% — di atas target BI (2.5%±1%). Daya beli lo tergerus ${data.inflation.value.toFixed(1)}% per tahun.`,
    });
  } else if (data.inflation.value >= 1.5 && data.inflation.value <= 3.5) {
    insights.push({
      type: "success",
      title: "Inflasi terkendali",
      message: `Inflasi ${data.inflation.value.toFixed(2)}% — masih dalam target BI (2.5%±1%). Harga barang relatif stabil.`,
    });
  } else if (data.inflation.value < 1.5) {
    insights.push({
      type: "info",
      title: "Inflasi rendah",
      message: `Inflasi ${data.inflation.value.toFixed(2)}% — di bawah target. Bisa jadi sinyal demand ekonomi melemah.`,
    });
  } else {
    insights.push({
      type: "warning",
      title: "Inflasi mulai naik",
      message: `Inflasi ${data.inflation.value.toFixed(2)}% — sedikit di atas target BI. Perlu monitor ke depan.`,
    });
  }

  // ========== INSIGHT 4: BI Rate Stance ==========
  const biFedGap = data.biRate.value - data.fedRate;
  if (data.biRate.holdMonths >= 6 && data.usdIdr.status === "red") {
    insights.push({
      type: "warning",
      title: "BI Rate stuck",
      message: `BI Rate tahan di ${data.biRate.value}% selama ${data.biRate.holdMonths} bulan — BI dilematis: pengen turun buat dorong ekonomi, tapi rupiah masih tertekan. Spread vs Fed: ${biFedGap.toFixed(2)}%.`,
    });
  } else if (biFedGap < 0.5) {
    insights.push({
      type: "warning",
      title: "Spread BI vs Fed sempit",
      message: `BI Rate (${data.biRate.value}%) cuma ${biFedGap.toFixed(2)}% di atas Fed Rate (${data.fedRate.toFixed(2)}%). Risiko capital outflow tinggi.`,
    });
  } else {
    insights.push({
      type: "info",
      title: "Spread BI vs Fed sehat",
      message: `BI Rate ${data.biRate.value}% (spread ${biFedGap.toFixed(2)}% di atas Fed). Cukup menarik buat hold aset rupiah.`,
    });
  }

  return insights;
}
