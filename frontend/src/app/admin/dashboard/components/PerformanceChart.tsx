"use client";

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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-brand-900 text-2xl">Hiệu suất hệ thống</h2>

          <p className="mt-1 text-sm text-gray-600">24 giờ qua</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="bg-brand-900 inline-flex h-3 w-3 rounded-full" />

            <span>Requests</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-accent-500 inline-flex h-3 w-3 rounded-full" />

            <span>Accuracy</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-end gap-2 px-2 pb-6">
          <div className="h-[25%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[40%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[30%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[55%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[45%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[75%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[50%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[90%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[60%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[80%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[40%] flex-1 animate-pulse rounded bg-gray-200/80" />
          <div className="h-[65%] flex-1 animate-pulse rounded bg-gray-200/80" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-brand-900)"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-brand-900)"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accent-500)"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-accent-500)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-neutral-200)"
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }}
            />

            <YAxis tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid var(--color-neutral-200)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="requests"
              stroke="var(--color-brand-900)"
              strokeWidth={2}
              fill="url(#colorRequests)"
            />

            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="var(--color-accent-500)"
              strokeWidth={2}
              fill="url(#colorAccuracy)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
