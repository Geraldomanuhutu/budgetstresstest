"use client";

import { cn } from "@/lib/utils";
import { Activity, TrendingDown } from "lucide-react";
import type { HealthScore } from "@/types";

interface HealthScoreHeroProps {
  score: HealthScore;
  lastUpdated: string;
}

const colorMap = {
  green: { bg: "from-success/20 to-success/5", text: "text-success-fg", ring: "ring-success/30" },
  yellow: { bg: "from-warning/20 to-warning/5", text: "text-warning-fg", ring: "ring-warning/30" },
  orange: { bg: "from-orange-200 to-orange-50", text: "text-orange-700", ring: "ring-orange-300" },
  red: { bg: "from-danger/20 to-danger/5", text: "text-danger-fg", ring: "ring-danger/30" },
};

export function HealthScoreHero({ score, lastUpdated }: HealthScoreHeroProps) {
  const colors = colorMap[score.color];
  const emoji = { green: "🟢", yellow: "🟡", orange: "🟠", red: "🔴" }[score.color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br p-8 shadow-sm animate-in",
        colors.bg
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Macro Health Score
            </p>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className={cn("text-7xl font-bold font-display tracking-tighter", colors.text)}>
              {score.score}
            </span>
            <span className="text-2xl text-muted-foreground font-medium">/ 100</span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold ring-1 bg-white/60",
                colors.text,
                colors.ring
              )}
            >
              {emoji} {score.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            📡 Update terakhir: <span className="font-medium text-foreground">{lastUpdated}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-danger" />
              <p className="text-xs font-medium text-muted-foreground">Trend 7 Hari</p>
            </div>
            <p className="text-2xl font-bold text-danger-fg">↓ 3 poin</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 Score tertekan karena <strong>rupiah & cadev</strong> di zona kuning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
