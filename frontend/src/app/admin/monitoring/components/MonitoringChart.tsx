import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ButtonCustom } from "@/components/common/form/button";

interface MonitoringChartProps {
  selectedMetric: "cpu" | "memory" | "requests";
  setSelectedMetric: (metric: "cpu" | "memory" | "requests") => void;
  chartData: { time: string; value: number }[];
}

export function MonitoringChart({
  selectedMetric,
  setSelectedMetric,
  chartData,
}: MonitoringChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-brand-900 text-2xl">Performance Metrics</h2>
          <p className="mt-1 text-sm text-gray-600">Real-time monitoring</p>
        </div>
        <div className="flex space-x-2">
          <ButtonCustom
            onClick={() => setSelectedMetric("cpu")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${
              selectedMetric === "cpu"
                ? "bg-brand-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            CPU
          </ButtonCustom>
          <ButtonCustom
            onClick={() => setSelectedMetric("memory")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${
              selectedMetric === "memory"
                ? "bg-brand-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Memory
          </ButtonCustom>
          <ButtonCustom
            onClick={() => setSelectedMetric("requests")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${
              selectedMetric === "requests"
                ? "bg-brand-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Requests
          </ButtonCustom>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={
              selectedMetric === "cpu"
                ? "var(--color-brand-900)"
                : selectedMetric === "memory"
                  ? "#10b981"
                  : "#8b5cf6"
            }
            strokeWidth={3}
            dot={{
              fill:
                selectedMetric === "cpu"
                  ? "var(--color-brand-900)"
                  : selectedMetric === "memory"
                    ? "#10b981"
                    : "#8b5cf6",
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
