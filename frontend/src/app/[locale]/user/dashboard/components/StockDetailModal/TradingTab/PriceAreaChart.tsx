import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceAreaChartProps {
  chartData: Array<{ date: string; close: number; volume: number }>;
}

export function PriceAreaChart({ chartData }: PriceAreaChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="dark:bg-slate-955/20 rounded-lg border border-gray-200 bg-gray-50/20 p-2 dark:border-slate-900">
      {isMounted ? (
        <ResponsiveContainer width="100%" height={210} minWidth={0}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPriceModal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={{ stroke: "var(--border)" }}
              tickFormatter={(value) => `${value.toLocaleString("vi-VN")}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "11px",
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorPriceModal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="bg-gray-105 h-[210px] w-full animate-pulse rounded dark:bg-slate-900/40" />
      )}
    </div>
  );
}
