"use client";

import { useEffect, useState } from "react";
import { Loader2, Info } from "lucide-react";
import type { MacroData } from "@/types";
import { calculateHealthScore } from "@/lib/health-score";
import { generateInsights } from "@/lib/insights";
import { HealthScoreHero } from "./health-score-hero";
import { MetricCard } from "./metric-card";
import { USDIDRChart } from "./usd-idr-chart";
import { InsightCard } from "./insight-card";

export function Dashboard() {
  const [data, setData] = useState<MacroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetch("/api/macro")
      .then((r) => r.json())
      .then((d: MacroData) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch macro data failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm text-muted-foreground mt-4">📡 Loading data makro...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-danger">Gagal load data. Refresh halaman ya.</p>
      </div>
    );
  }

  const score = calculateHealthScore(data);
  const insights = generateInsights(data);

  return (
    <div className="space-y-8">
      {/* Health Score Hero */}
      <HealthScoreHero score={score} lastUpdated={data.lastUpdated} />

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
        >
          <Info className="w-4 h-4" />
          Tentang sumber data {showInfo ? "▾" : "▸"}
        </button>
        {showInfo && (
          <div className="mt-3 text-xs text-blue-900/80 space-y-2 leading-relaxed animate-in">
            <p>
              <strong>🟢 Live (refresh tiap 1 jam):</strong> USD/IDR, IHSG, Brent Oil, Dollar Index via Yahoo Finance. Fed Rate via FRED API.
            </p>
            <p>
              <strong>📅 Manual (sumber: BI/BPS):</strong> Cadangan Devisa, BI Rate, Inflasi, PDB, Yield SBN, PMI, Trade Balance — perlu update bulanan dari sumber resmi.
            </p>
          </div>
        )}
      </div>

      {/* Tier 1: Live */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔥</span>
          <h2 className="text-base font-semibold font-display">Live (Daily)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="USD / IDR"
            value={`Rp ${data.usdIdr.value.toLocaleString("id-ID")}`}
            delta={`${data.usdIdr.changePct > 0 ? "+" : ""}${data.usdIdr.changePct.toFixed(2)}%`}
            deltaDirection={data.usdIdr.changePct > 0 ? "up" : data.usdIdr.changePct < 0 ? "down" : "flat"}
            status={data.usdIdr.status}
            statusLabel={data.usdIdr.label}
            source={data.usdIdr.source}
            caption={`Asumsi APBN 2026: Rp ${data.usdIdr.benchmark.toLocaleString("id-ID")}`}
          />
          <MetricCard
            label="Yield SBN 10Y"
            value={`${data.yield10y.value.toFixed(2)}%`}
            delta={`${data.yield10y.change > 0 ? "+" : ""}${data.yield10y.change.toFixed(2)}%`}
            deltaDirection={data.yield10y.change > 0 ? "up" : "down"}
            status={data.yield10y.status}
            statusLabel={data.yield10y.label}
            caption="Termometer kepercayaan investor"
          />
          <MetricCard
            label="IHSG"
            value={data.ihsg.value.toLocaleString("id-ID")}
            delta={`${data.ihsg.changePct > 0 ? "+" : ""}${data.ihsg.changePct.toFixed(2)}%`}
            deltaDirection={data.ihsg.changePct > 0 ? "up" : "down"}
            status={data.ihsg.status}
            statusLabel={data.ihsg.label}
            source={data.ihsg.source}
          />
        </div>
      </section>

      {/* Tier 2: Core */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h2 className="text-base font-semibold font-display">Core (Monthly)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Cadangan Devisa"
            value={`$${data.cadev.value.toFixed(1)}M`}
            delta={`${data.cadev.change > 0 ? "+" : ""}$${data.cadev.change.toFixed(1)}M MoM`}
            deltaDirection={data.cadev.change > 0 ? "up" : "down"}
            status={data.cadev.status}
            statusLabel={data.cadev.label}
            caption={`Cover ${data.cadev.monthsImport} bulan impor`}
          />
          <MetricCard
            label="Inflasi (YoY)"
            value={`${data.inflation.value.toFixed(2)}%`}
            delta={`${data.inflation.change > 0 ? "+" : ""}${data.inflation.change.toFixed(2)}% MoM`}
            deltaDirection={data.inflation.change < 0 ? "down" : "up"}
            status={data.inflation.status}
            statusLabel={data.inflation.label}
            caption="Target BI: 2,5% ±1%"
          />
          <MetricCard
            label="BI Rate"
            value={`${data.biRate.value.toFixed(2)}%`}
            status={data.biRate.status}
            statusLabel={data.biRate.label}
            caption={`Tahan ${data.biRate.holdMonths} bulan berturut`}
          />
          <MetricCard
            label="Neraca Dagang"
            value={`${data.tradeBalance.value > 0 ? "+" : ""}$${data.tradeBalance.value.toFixed(1)}M`}
            status={data.tradeBalance.status}
            statusLabel={data.tradeBalance.label}
            caption={`Surplus ke-${data.tradeBalance.streak} bulan`}
          />
        </div>
      </section>

      {/* Tier 3: Growth */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📈</span>
          <h2 className="text-base font-semibold font-display">Growth (Quarterly)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            label="PDB Growth"
            value={`${data.gdp.value.toFixed(2)}%`}
            delta={`${data.gdp.change > 0 ? "+" : ""}${data.gdp.change.toFixed(2)}%`}
            deltaDirection={data.gdp.change > 0 ? "up" : "down"}
            status={data.gdp.status}
            statusLabel={data.gdp.label}
            caption="Q4 2025 — tertinggi sejak Q3 2022"
          />
          <MetricCard
            label="PMI Manufaktur"
            value={data.pmi.value.toFixed(1)}
            status={data.pmi.status}
            statusLabel={data.pmi.label}
            caption="Di atas 50 = ekspansi"
          />
        </div>
      </section>

      {/* Chart */}
      <section>
        <USDIDRChart data={data.usdIdr.history || []} benchmark={data.usdIdr.benchmark} />
      </section>

      {/* Tier 4: Global */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🌍</span>
          <h2 className="text-base font-semibold font-display">Global Context</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Fed Funds Rate"
            value={`${data.fedRate.toFixed(2)}%`}
            caption="Selisih dengan BI Rate ngaruh ke aliran modal"
          />
          <MetricCard
            label="Brent Oil"
            value={`$${data.brent.toFixed(2)}`}
            caption="Indonesia importir minyak — sensitif"
          />
          <MetricCard
            label="DXY (Dollar Index)"
            value={data.dxy.toFixed(1)}
            caption="Dolar kuat = tekanan ke emerging market"
          />
        </div>
      </section>

      {/* Dynamic Insights — auto-generated berdasarkan kondisi data */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <h2 className="text-base font-semibold font-display">Insight Otomatis</h2>
          <span className="text-xs text-muted-foreground">
            (update real-time sesuai kondisi indikator)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
