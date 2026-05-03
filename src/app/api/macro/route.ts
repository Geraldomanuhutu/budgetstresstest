// ============================================================
// API Route: /api/macro
// Fetches live macro data dari Yahoo Finance + FRED
// ============================================================

import { NextResponse } from "next/server";
import type { MacroData, StatusColor } from "@/types";
import { APBN_2026 } from "@/lib/health-score";

// Cache 1 jam di Vercel Edge
export const revalidate = 3600;

// ============================================================
// Fallback values (last-known per Mei 2026)
// Source: BI, BPS, Kemenkeu — update manual sebulan sekali
// ============================================================
const FALLBACK = {
  usdIdr: { value: 17380, changePct: 0.62 },
  ihsg: { value: 7234, changePct: -0.34 },
  brent: 89.5,
  dxy: 99.8,
  fedRate: 3.75,
  // Manual indicators:
  yield10y: { value: 6.85, change: 0.12 },
  cadev: { value: 148.2, change: -3.7, monthsImport: 6.2 },
  inflation: { value: 3.48, change: -1.28 },
  biRate: { value: 4.75, holdMonths: 7 },
  tradeBalance: { value: 2.1, streak: 67 },
  gdp: { value: 5.39, change: 0.35 },
  pmi: { value: 51.2 },
};

// ============================================================
// Yahoo Finance fetcher (via query1 endpoint, no key needed)
// ============================================================
async function fetchYahoo(ticker: string): Promise<{ value: number; changePct: number; history: { date: string; value: number }[] } | null> {
  try {
    // Yahoo Finance Chart API endpoint
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1mo`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Yahoo fetch ${ticker} failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
    const timestamps: number[] = result.timestamp ?? [];

    const validData = closes
      .map((c, i) => ({ close: c, ts: timestamps[i] }))
      .filter((d) => d.close !== null && d.close !== undefined);

    if (validData.length < 2) return null;

    const current = validData[validData.length - 1].close;
    const prev = validData[validData.length - 2].close;
    const changePct = ((current - prev) / prev) * 100;

    const history = validData.map((d) => ({
      date: new Date(d.ts * 1000).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      value: Math.round(d.close),
    }));

    return {
      value: current,
      changePct,
      history,
    };
  } catch (e) {
    console.warn(`Yahoo fetch ${ticker} error:`, e);
    return null;
  }
}

// ============================================================
// FRED API fetcher (Fed Funds Rate)
// ============================================================
async function fetchFedRate(): Promise<number | null> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DFF&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;
    const res = await fetch(url, { next: { revalidate: 21600 } });
    if (!res.ok) return null;

    const data = await res.json();
    const obs = data?.observations?.[0];
    if (!obs?.value) return null;

    const value = parseFloat(obs.value);
    return isNaN(value) ? null : value;
  } catch {
    return null;
  }
}

// ============================================================
// Status determination helpers
// ============================================================
function usdIdrStatus(value: number, benchmark: number): { status: StatusColor; label: string } {
  const dev = (value - benchmark) / benchmark;
  if (dev < 0.02) return { status: "green", label: "Stabil" };
  if (dev < 0.04) return { status: "yellow", label: "Melemah" };
  return { status: "red", label: "Tertekan berat" };
}

function ihsgStatus(changePct: number): { status: StatusColor; label: string } {
  if (changePct > 1) return { status: "green", label: "Menguat" };
  if (changePct > -1) return { status: "yellow", label: "Sideways" };
  return { status: "red", label: "Melemah" };
}

// ============================================================
// Main GET handler
// ============================================================
export async function GET() {
  // Fetch live data parallel
  const [usdIdrLive, ihsgLive, brentLive, dxyLive, fedLive] = await Promise.all([
    fetchYahoo("IDR=X"),
    fetchYahoo("^JKSE"),
    fetchYahoo("BZ=F"),
    fetchYahoo("DX-Y.NYB"),
    fetchFedRate(),
  ]);

  // USD/IDR
  const usdIdrValue = usdIdrLive?.value ?? FALLBACK.usdIdr.value;
  const usdIdrChange = usdIdrLive?.changePct ?? FALLBACK.usdIdr.changePct;
  const usdIdrSt = usdIdrStatus(usdIdrValue, APBN_2026.kurs);

  // History (kalo gada, generate flat)
  const usdIdrHistory = usdIdrLive?.history ?? generateFlatHistory(usdIdrValue, 30);

  // IHSG
  const ihsgValue = ihsgLive?.value ?? FALLBACK.ihsg.value;
  const ihsgChange = ihsgLive?.changePct ?? FALLBACK.ihsg.changePct;
  const ihsgSt = ihsgStatus(ihsgChange);

  // Manual data (status auto-derived)
  const cadev = FALLBACK.cadev;
  const cadevStatus: StatusColor =
    cadev.monthsImport >= 6 ? "green" : cadev.monthsImport >= 3 ? "yellow" : "red";

  const inflation = FALLBACK.inflation;
  const inflationStatus: StatusColor =
    inflation.value >= 1.5 && inflation.value <= 3.5 ? "green" : inflation.value < 5 ? "yellow" : "red";

  const result: MacroData = {
    usdIdr: {
      value: Math.round(usdIdrValue),
      benchmark: APBN_2026.kurs,
      changePct: Math.round(usdIdrChange * 100) / 100,
      status: usdIdrSt.status,
      label: usdIdrSt.label,
      history: usdIdrHistory,
      source: usdIdrLive ? "live" : "fallback",
    },
    ihsg: {
      value: Math.round(ihsgValue),
      changePct: Math.round(ihsgChange * 100) / 100,
      status: ihsgSt.status,
      label: ihsgSt.label,
      foreignFlow: "Data realtime butuh source lain",
      source: ihsgLive ? "live" : "fallback",
    },
    yield10y: {
      ...FALLBACK.yield10y,
      status: FALLBACK.yield10y.value < 7 ? "yellow" : "red",
      label: FALLBACK.yield10y.value >= 6.8 ? "Naik, ada tekanan" : "Stabil",
    },
    cadev: {
      ...cadev,
      status: cadevStatus,
      label: cadev.change < 0 ? "Aman tapi tergerus" : "Stabil",
    },
    inflation: {
      ...inflation,
      status: inflationStatus,
      label: inflation.value >= 1.5 && inflation.value <= 3.5 ? "Dalam target" : "Di luar target",
    },
    biRate: {
      ...FALLBACK.biRate,
      status: FALLBACK.biRate.holdMonths >= 3 ? "yellow" : "green",
      label: FALLBACK.biRate.holdMonths >= 3 ? "Stuck (jaga rupiah)" : "Aktif",
    },
    tradeBalance: {
      ...FALLBACK.tradeBalance,
      status: FALLBACK.tradeBalance.value > 0 ? "green" : "red",
      label: FALLBACK.tradeBalance.value > 0 ? "Surplus" : "Defisit",
    },
    gdp: {
      ...FALLBACK.gdp,
      status: FALLBACK.gdp.value >= 5 ? "green" : FALLBACK.gdp.value >= 3 ? "yellow" : "red",
      label: FALLBACK.gdp.value >= 5 ? "Kuat" : "Melambat",
    },
    pmi: {
      ...FALLBACK.pmi,
      status: FALLBACK.pmi.value >= 50 ? "green" : "red",
      label: FALLBACK.pmi.value >= 50 ? "Ekspansi" : "Kontraksi",
    },
    fedRate: fedLive ?? FALLBACK.fedRate,
    brent: brentLive?.value ? Math.round(brentLive.value * 100) / 100 : FALLBACK.brent,
    dxy: dxyLive?.value ? Math.round(dxyLive.value * 100) / 100 : FALLBACK.dxy,
    lastUpdated: new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB",
  };

  return NextResponse.json(result);
}

// Helper: generate flat history kalo live data ga ada
function generateFlatHistory(value: number, days: number) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      value: Math.round(value),
    });
  }
  return result;
}
