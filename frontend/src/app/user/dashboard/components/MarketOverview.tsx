"use client";

import { useQueries } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";

import { MARKET_INDICES } from "@/constants/stock";
import { getIndexQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { initialStockData } from "@/queries/stocks/QueryHooksStocks";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

function useMarketIndices() {
  const queries = useQueries({
    queries: MARKET_INDICES.map(({ symbol }) => ({
      queryKey: ["index-quote", symbol],
      queryFn: () =>
        getIndexQuoteQueryFn({
          symbol,
          type: MarketType.STOCK,
          period: TimePeriod.ONE_DAY,
        }),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading || !q.data);

  const indices = MARKET_INDICES.map(({ label }, index) => ({
    label,
    data: queries[index].data ?? initialStockData,
  }));

  return { indices, isLoading };
}

export function MarketOverview() {
  const { indices: marketIndices, isLoading } = useMarketIndices();

  if (isLoading) {
    return (
      <div className="from-brand-900 to-brand-700 rounded-xl bg-linear-to-r p-6 text-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-44 animate-pulse rounded-md bg-white/20" />
          <div className="h-4 w-32 animate-pulse rounded-md bg-white/20" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 h-4.5 w-16 rounded bg-white/20" />
              <div className="mb-2 h-8 w-24 rounded bg-white/20" />
              <div className="h-4.5 w-16 rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const indices = marketIndices.map(({ label, data }) => ({
    name: label,
    value: data.price.toLocaleString(),
    change: data.change_percent,
    trend: data.change_percent >= 0 ? "up" : "down",
  }));

  return (
    <div className="from-brand-900 to-brand-700 rounded-xl bg-linear-to-r p-6 text-white shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg">Tổng quan thị trường</h2>
        <div className="text-sm text-blue-200">
          Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {indices.map((index) => (
          <div
            key={index.name}
            className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="mb-2 text-xs text-blue-200">{index.name}</div>
            <div className="mb-1 text-2xl">{index.value}</div>

            <div
              className={`flex items-center space-x-1 text-sm ${
                index.trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {index.trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {index.change >= 0 ? "+" : ""}
                {index.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
