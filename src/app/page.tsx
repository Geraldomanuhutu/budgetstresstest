"use client";

import { useState } from "react";
import { BarChart3, FlaskConical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dashboard } from "@/components/dashboard";
import { StressTest } from "@/components/stress-test";
import { Methodology } from "@/components/methodology";

type Tab = "dashboard" | "stress";

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display tracking-tight">Macro Stress Test</h1>
              <p className="text-[11px] text-muted-foreground">Cek ketahanan finansial lo</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="dot-status bg-success animate-pulse" />
            <span>Live data</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl w-fit">
          <button
            onClick={() => setTab("dashboard")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "dashboard"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard Makro
          </button>
          <button
            onClick={() => setTab("stress")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "stress"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FlaskConical className="w-4 h-4" />
            Budget Stress Test
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "dashboard" ? <Dashboard /> : <StressTest />}

        {/* Methodology - selalu show, ga tergantung tab */}
        <Methodology />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 mt-12 border-t border-slate-200/60">
        <p className="text-xs text-muted-foreground leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> Apps ini buat simulasi & edukasi. Asumsi skenario berbasis data historis tapi masa depan bisa beda. Konsultasi sama financial planner buat keputusan finansial real.
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Built with ❤️ for Gen Z Indonesia • Data: BI, BPS, Yahoo Finance, FRED
        </p>
      </footer>
    </div>
  );
}
