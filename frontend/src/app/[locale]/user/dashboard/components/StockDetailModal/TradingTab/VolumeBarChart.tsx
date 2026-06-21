import React, { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VolumeBarChartProps {
  chartData: Array<{ date: string; close: number; volume: number }>;
}

export function VolumeBarChart({ chartData }: VolumeBarChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="dark:bg-slate-955/20 rounded-lg border border-gray-200 bg-gray-50/20 p-2 dark:border-slate-900">
      {isMounted ? (
        <ResponsiveContainer width="100%" height={90} minWidth={0}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={{ stroke: "var(--border)" }}
              tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
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
            <Bar dataKey="volume" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="bg-gray-105 h-[90px] w-full animate-pulse rounded dark:bg-slate-900/40" />
      )}
    </div>
  );
}
