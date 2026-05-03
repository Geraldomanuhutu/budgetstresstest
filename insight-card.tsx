"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, AlertOctagon } from "lucide-react";
import type { Insight } from "@/lib/insights";

const styles = {
  success: {
    bg: "bg-success-bg",
    border: "border-success/20",
    text: "text-success-fg",
    icon: CheckCircle2,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200/60",
    text: "text-blue-900",
    icon: Info,
  },
  warning: {
    bg: "bg-warning-bg",
    border: "border-warning/20",
    text: "text-warning-fg",
    icon: AlertTriangle,
  },
  danger: {
    bg: "bg-danger-bg",
    border: "border-danger/20",
    text: "text-danger-fg",
    icon: AlertOctagon,
  },
};

export function InsightCard({ insight }: { insight: Insight }) {
  const s = styles[insight.type];
  const Icon = s.icon;

  return (
    <div className={cn("rounded-xl border p-5 animate-in", s.bg, s.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", s.text)} />
        <div className="flex-1">
          <p className={cn("text-xs font-bold uppercase tracking-wider mb-1.5", s.text)}>
            💡 {insight.title}
          </p>
          <p className={cn("text-sm leading-relaxed", s.text)}>
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );
}
