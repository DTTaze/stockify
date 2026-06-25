"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminDashboardPerformanceType } from "@/types/admin/admin.type";

interface PerformanceChartProps {
  performanceData: AdminDashboardPerformanceType[];
  isLoading: boolean;
}

export function PerformanceChart(props: PerformanceChartProps) {
  const { performanceData, isLoading } = props;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="border-border bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-brand-900 text-2xl font-semibold dark:text-neutral-50">
            Hiệu suất hệ thống
          </h2>

          <p className="text-muted-foreground mt-1 text-sm">24 giờ qua</p>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-[var(--chart-1)]" />

            <span>Requests</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-[var(--chart-2)]" />

            <span>Accuracy</span>
          </div>
        </div>
      </div>

      {isLoading || !isMounted ? (
        <div className="flex h-80 items-end gap-2 px-2 pb-6">
          <div className="bg-muted h-[25%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[40%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[30%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[55%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[45%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[75%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[50%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[90%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[60%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[80%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[40%] flex-1 animate-pulse rounded" />
          <div className="bg-muted h-[65%] flex-1 animate-pulse rounded" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />

                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.3}
                />

                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

            <XAxis
              dataKey="time"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />

            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />

            <Area
              type="monotone"
              dataKey="requests"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#colorRequests)"
            />

            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#colorAccuracy)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
