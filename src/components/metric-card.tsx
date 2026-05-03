"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatusColor } from "@/types";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  status?: StatusColor;
  statusLabel?: string;
  source?: "live" | "fallback";
  caption?: string;
  className?: string;
}

const statusStyles: Record<StatusColor, { bg: string; border: string; dot: string; text: string }> = {
  green: {
    bg: "bg-success-bg",
    border: "border-success/20",
    dot: "bg-success",
    text: "text-success-fg",
  },
  yellow: {
    bg: "bg-warning-bg",
    border: "border-warning/20",
    dot: "bg-warning",
    text: "text-warning-fg",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
    text: "text-orange-700",
  },
  red: {
    bg: "bg-danger-bg",
    border: "border-danger/20",
    dot: "bg-danger",
    text: "text-danger-fg",
  },
};

export function MetricCard({
  label,
  value,
  delta,
  deltaDirection,
  status,
  statusLabel,
  source,
  caption,
  className,
}: MetricCardProps) {
  const styles = status ? statusStyles[status] : null;

  return (
    <div
      className={cn(
        "premium-card p-5 animate-in",
        styles?.bg,
        styles?.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {source && (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase",
              source === "live"
                ? "bg-success/10 text-success-fg"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {source === "live" ? "● Live" : "Cached"}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold font-display tracking-tight text-foreground">
        {value}
      </p>

      {delta && (
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-xs font-medium",
            deltaDirection === "up" && "text-success-fg",
            deltaDirection === "down" && "text-danger-fg",
            deltaDirection === "flat" && "text-muted-foreground"
          )}
        >
          {deltaDirection === "up" && <TrendingUp className="w-3.5 h-3.5" />}
          {deltaDirection === "down" && <TrendingDown className="w-3.5 h-3.5" />}
          {deltaDirection === "flat" && <Minus className="w-3.5 h-3.5" />}
          <span>{delta}</span>
        </div>
      )}

      {status && statusLabel && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
          <span className={cn("dot-status", styles?.dot)} />
          <span className={cn("text-xs font-medium", styles?.text)}>
            {statusLabel}
          </span>
        </div>
      )}

      {caption && (
        <p className="text-[11px] text-muted-foreground mt-2">{caption}</p>
      )}
    </div>
  );
}
