import React from "react";

import { getQuoteColor } from "./utils";

interface QuickQuoteRibbonProps {
  priceUnit: number;
  change: number;
  tran: number;
  san: number;
  tc: number;
  volume: number;
}

export function QuickQuoteRibbon({
  priceUnit,
  change,
  tran,
  san,
  tc,
  volume,
}: QuickQuoteRibbonProps) {
  const quoteColor = getQuoteColor(change);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-slate-900/60 dark:bg-slate-900/30">
      <div className="flex items-center gap-4">
        <div className={`text-2xl font-extrabold tracking-tight ${quoteColor}`}>
          {priceUnit.toFixed(2)}
        </div>
        <div className={`flex flex-col text-xs font-bold ${quoteColor}`}>
          <span>
            {change >= 0 ? "+" : ""}
            {((priceUnit * change) / 100).toFixed(2)}
          </span>
          <span>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-semibold text-gray-500 dark:text-slate-400">
        <div>
          <span>Trần:</span>
          <span className="ml-1 font-extrabold text-fuchsia-600 dark:text-fuchsia-400">
            {tran.toFixed(2)}
          </span>
        </div>
        <div>
          <span>Sàn:</span>
          <span className="ml-1 font-extrabold text-cyan-600 dark:text-cyan-400">
            {san.toFixed(2)}
          </span>
        </div>
        <div>
          <span>TC:</span>
          <span className="ml-1 font-extrabold text-amber-500 dark:text-yellow-400">
            {tc.toFixed(2)}
          </span>
        </div>
        <div className="flex h-6 items-center border-l border-gray-200 pl-6 dark:border-slate-800">
          <span>Mở cửa:</span>
          <span className="ml-1 text-amber-500 dark:text-yellow-400">
            {(tc * 1.01).toFixed(2)}
          </span>
        </div>
        <div>
          <span>Thấp/Cao:</span>
          <span className="ml-1 text-rose-600 dark:text-rose-500">
            {(priceUnit * 0.985).toFixed(2)}
          </span>
          <span className="mx-1 text-gray-400 dark:text-slate-600">/</span>
          <span className="text-green-600 dark:text-green-400">
            {(priceUnit * 1.03).toFixed(2)}
          </span>
        </div>
        <div>
          <span>Tổng KL:</span>
          <span className="ml-1 font-bold text-gray-800 dark:text-slate-200">
            {volume ? volume.toLocaleString("vi-VN") : "--"}
          </span>
        </div>
      </div>
    </div>
  );
}
