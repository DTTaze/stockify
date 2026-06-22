"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/providers/LanguageProvider";

interface PredictionChartProps {
  forecastChartData: Array<{
    name: string;
    actual?: number;
    predicted?: number;
    confidence?: number;
  }>;
  isMounted: boolean;
}

export function PredictionChart({
  forecastChartData,
  isMounted,
}: PredictionChartProps) {
  const { t } = useLanguage();

  return (
    <Card className="dark:bg-slate-955/20 gap-0 rounded-xl border border-gray-200 bg-gray-50/20 p-4 py-4 md:col-span-3 dark:border-slate-900">
      <span className="dark:text-slate-550 mb-3 block text-xs font-bold tracking-wider text-gray-500 uppercase">
        {t("prediction.trendLine")}
      </span>
      {isMounted ? (
        <ResponsiveContainer width="100%" height={160} minWidth={0}>
          <LineChart data={forecastChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={{ stroke: "var(--border)" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value: number | string, name: string) => {
                const priceVal =
                  typeof value === "number"
                    ? value
                    : parseFloat(value as string);
                if (isNaN(priceVal)) {
                  return [value, name];
                }
                return [`${(priceVal * 1000).toLocaleString("vi-VN")} ₫`, name];
              }}
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "11px",
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name={t("prediction.actualPrice") || "Giá thực tế"}
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#34d399", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name={t("prediction.predictedPrice") || "Giá dự báo"}
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#c084fc", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="bg-gray-105 h-[160px] w-full animate-pulse rounded dark:bg-slate-900/40" />
      )}
    </Card>
  );
}
