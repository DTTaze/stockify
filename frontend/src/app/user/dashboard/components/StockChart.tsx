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

import { useQueryQuoteHistorical } from "@/queries/stocks/QueryHooksStocks";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

interface Props {
  symbol: string;
  period: TimePeriod;
}

export function StockChart(props: Props) {
  const { symbol, period } = props;
  const { data, isLoading } = useQueryQuoteHistorical({
    symbol,
    type: MarketType.STOCK,
    period,
  });

  if (isLoading) return <div>Loading...</div>;

  const chartData =
    data?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      close: item.close,
      volume: item.volume,
    })) || [];

  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-brand-900 text-2xl">Biểu đồ giá</h2>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
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
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis tickFormatter={(value) => `${value}`} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="close"
            stroke="var(--color-brand-900)"
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
