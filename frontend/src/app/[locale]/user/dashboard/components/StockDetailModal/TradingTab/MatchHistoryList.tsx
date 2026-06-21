"use client";

import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { SimulatedMatchLog } from "@/utils/stockQuoteSim";

import { getPriceColor } from "../utils";

interface MatchHistoryListProps {
  matchHistory: SimulatedMatchLog[];
  san: number;
  tran: number;
  tc: number;
  totalBuyVol: number;
  totalSellVol: number;
  quoteVolume: number;
}

export function MatchHistoryList({
  matchHistory,
  san,
  tran,
  tc,
  totalBuyVol,
  totalSellVol,
  quoteVolume,
}: MatchHistoryListProps) {
  const { t } = useLanguage();

  const formatBoardVolume = (val: number) => {
    if (val <= 0) {
      return "--";
    }
    return Math.round(val / 10).toLocaleString("vi-VN");
  };

  const buyLabel = t("trading.buy")[0];
  const sellLabel = t("trading.sell")[0];

  return (
    <div className="bg-gray-55/30 flex h-full flex-col justify-between rounded-lg border border-gray-200 p-3 lg:col-span-3 dark:border-slate-900 dark:bg-slate-900/10">
      <div>
        <h3 className="dark:text-slate-405 mb-2 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
          {t("trading.matched")}
        </h3>

        <div className="text-gray-550 mb-2 flex justify-between border-b border-gray-200 pb-1 font-sans text-[11px] font-bold uppercase dark:border-slate-900/50 dark:text-slate-500">
          <span>
            {t("ticker.vol")}: {formatBoardVolume(quoteVolume)}
          </span>
          <span className="text-green-600 dark:text-green-400">
            {buyLabel}: {(totalBuyVol / 1000).toFixed(1)}K
          </span>
          <span className="text-red-600 dark:text-red-400">
            {sellLabel}: {(totalSellVol / 1000).toFixed(1)}K
          </span>
        </div>

        {/* Trades List */}
        <div className="no-scrollbar max-h-52 overflow-y-auto">
          <table className="w-full border-collapse text-right font-mono text-xs select-none">
            <thead>
              <tr className="dark:text-slate-505 border-gray-250 border-b font-sans text-[11px] text-gray-500 dark:border-slate-900">
                <th className="pb-1 text-left">{t("trading.time")}</th>
                <th className="pb-1">{t("trading.bidVol")}</th>
                <th className="pb-1">{t("trading.price")}</th>
                <th className="pb-1">{t("trading.changePercent")}</th>
                <th className="w-6 pb-1 text-center">
                  {t("trading.buySellAbbr")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-slate-900/20">
              {matchHistory.map((trade) => {
                const tradeColor =
                  trade.change === 0
                    ? "text-amber-550 dark:text-yellow-400"
                    : trade.change > 0
                      ? "text-emerald-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-500";

                return (
                  <tr key={`trade-${trade.time}-${trade.volume}`}>
                    <td className="dark:text-slate-505 py-1 text-left font-sans text-gray-500">
                      {trade.time}
                    </td>
                    <td className="py-1 font-normal text-gray-700 dark:text-slate-300">
                      {trade.volume.toLocaleString("vi-VN")}
                    </td>
                    <td
                      className={`py-1 ${getPriceColor(trade.price, tc, tran, san)}`}
                    >
                      {trade.price.toFixed(2)}
                    </td>
                    <td className={`py-1 ${tradeColor}`}>
                      {trade.change.toFixed(1)}%
                    </td>
                    <td
                      className={`w-6 py-1 text-center font-sans text-[10px] font-bold ${
                        trade.type === "M"
                          ? "text-green-600 dark:text-green-400"
                          : "dark:text-red-450 text-red-600"
                      }`}
                    >
                      {trade.type === "M" ? buyLabel : sellLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
