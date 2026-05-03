"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ChartProps {
  data: { date: string; value: number }[];
  benchmark: number;
}

export function USDIDRChart({ data, benchmark }: ChartProps) {
  return (
    <div className="premium-card p-6 animate-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold font-display">USD / IDR</h3>
          <p className="text-xs text-muted-foreground">30 hari terakhir</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-brand" />
            <span className="text-muted-foreground">Realtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-danger" />
            <span className="text-muted-foreground">APBN 2026</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              // Domain harus selalu include benchmark biar reference line visible
              domain={[
                (dataMin: number) => Math.min(dataMin, benchmark) - 200,
                (dataMax: number) => Math.max(dataMax, benchmark) + 200,
              ]}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "USD/IDR"]}
            />
            <ReferenceLine
              y={benchmark}
              stroke="hsl(0 84% 60%)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `🇮🇩 APBN 2026: Rp ${benchmark.toLocaleString("id-ID")}`,
                position: "insideTopLeft",
                fontSize: 11,
                fontWeight: 600,
                fill: "hsl(0 74% 42%)",
                offset: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(221 83% 53%)"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
