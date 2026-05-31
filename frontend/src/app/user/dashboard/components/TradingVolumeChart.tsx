"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TradingVolumeChartSkeleton } from "@/app/user/dashboard/components/TradingVolumeChartSkeleton";
import { useQueryStockHistorical } from "@/queries/stocks/QueryHooksStocks";
import {
  MarketType,
  StockHistoricalDataType,
  TimePeriod,
} from "@/types/stock/stock.type";

interface TradingVolumeChartProps {
  symbol: string;
  period: TimePeriod;
}

export default function TradingVolumeChart({
  symbol,
  period,
}: TradingVolumeChartProps) {
  const { data, isLoading } = useQueryStockHistorical({
    symbol,
    type: MarketType.STOCK,
    period,
  });

  if (isLoading) {
    return <TradingVolumeChartSkeleton />;
  }

  const chartData =
    data?.map((item: StockHistoricalDataType) => ({
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      volume: item.volume,
    })) || [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-brand-900 mb-4 text-lg">Khối lượng giao dịch</h3>

      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />

          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
          />

          <Tooltip />

          <Bar
            dataKey="volume"
            fill="var(--color-accent-500)"
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
