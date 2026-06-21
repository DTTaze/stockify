"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { StockDataType } from "@/types/stock/stock.type";

interface TickerItemProps {
  label: string;
  data: StockDataType;
}

export function TickerItem({ label, data }: TickerItemProps) {
  const { t } = useLanguage();
  const isUp = data.change_percent >= 0;
  const changePercent = data.change_percent;

  // Calculate a mocked change amount from percentage for classic index board look
  const refPrice = data.price / (1 + changePercent / 100);
  const changeVal = data.price - refPrice;

  return (
    <div className="hover:bg-gray-55 flex items-center space-x-3 rounded border border-gray-200 bg-white px-3 py-1 transition-colors dark:border-slate-800/60 dark:bg-slate-950/40 dark:hover:bg-slate-950/80">
      <span className="text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-slate-300">
        {label}
      </span>
      <span
        className={`text-sm font-bold tracking-tight ${
          isUp
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-500"
        }`}
      >
        {data.price.toLocaleString("vi-VN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <div
        className={`flex items-center text-xs font-semibold ${
          isUp
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-500"
        }`}
      >
        {isUp ? (
          <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
        )}
        <span>
          {isUp ? "+" : ""}
          {changeVal.toFixed(2)} ({isUp ? "+" : ""}
          {changePercent.toFixed(2)}%)
        </span>
      </div>
      <span className="text-gray-505 text-[10px] font-semibold dark:text-slate-500">
        {t("ticker.vol")}: {(data.volume / 1_000_000).toFixed(1)}M
      </span>
    </div>
  );
}
