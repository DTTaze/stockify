"use client";

import React from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { TimePeriod } from "@/types/stock/stock.type";
import {
  OrderBookSimulation,
  PriceLimits,
  SimulatedMatchLog,
} from "@/utils/stockQuoteSim";

import { TIME_RANGE_MAP } from "../utils";
import { MatchHistoryList } from "./MatchHistoryList";
import { OrderBook } from "./OrderBook";
import { PriceAreaChart } from "./PriceAreaChart";
import { VolumeBarChart } from "./VolumeBarChart";

interface TradingTabProps {
  symbol: string;
  exchange: string;
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
  isHistoryLoading: boolean;
  chartData: Array<{ date: string; close: number; volume: number }>;
  limits: PriceLimits;
  orderBook: OrderBookSimulation;
  matchHistory: SimulatedMatchLog[];
  quoteVolume: number;
}

export function TradingTab({
  symbol,
  exchange,
  period,
  setPeriod,
  isHistoryLoading,
  chartData,
  limits,
  orderBook,
  matchHistory,
  quoteVolume,
}: TradingTabProps) {
  const { t } = useLanguage();

  const activePeriodLabel =
    Object.keys(TIME_RANGE_MAP).find((k) => TIME_RANGE_MAP[k] === period) ||
    "1D";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Left Pane: Large Price Area & Volume charts (Takes 6 cols) */}
      <div className="flex flex-col gap-3 lg:col-span-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-slate-400">
            {t("trading.chartTitle", {
              symbol,
              period: activePeriodLabel,
              exchange,
            })}
          </span>
          <div className="bg-gray-105 flex gap-1 rounded border border-gray-200 p-0.5 dark:border-slate-900 dark:bg-slate-950">
            {Object.entries(TIME_RANGE_MAP).map(([label, valPeriod]) => (
              <ButtonCustom
                key={label}
                onClick={() => setPeriod(valPeriod)}
                className={`h-6 rounded px-2 text-[9px] font-extrabold transition-all ${
                  period === valPeriod
                    ? "bg-indigo-600 text-white shadow shadow-indigo-600/30"
                    : "text-gray-505 dark:hover:text-slate-250 bg-transparent hover:text-gray-800 dark:text-slate-400"
                }`}
              >
                {label}
              </ButtonCustom>
            ))}
          </div>
        </div>

        {isHistoryLoading ? (
          <div className="flex h-64 animate-pulse flex-col items-center justify-center space-y-4">
            <div className="border-slate-805 h-40 w-full rounded border bg-slate-900/60" />
            <div className="border-slate-805 h-20 w-full rounded border bg-slate-900/60" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-xs text-slate-500">
            {t("trading.noChartData")}
          </div>
        ) : (
          <div className="space-y-4">
            <PriceAreaChart chartData={chartData} />
            <VolumeBarChart chartData={chartData} />
          </div>
        )}
      </div>

      {/* Middle Pane: Market Depth (Takes 3 cols) */}
      <OrderBook orderBook={orderBook} limits={limits} />

      {/* Right Pane: Match History (Takes 3 cols) */}
      <MatchHistoryList
        matchHistory={matchHistory}
        tc={limits.tc}
        tran={limits.tran}
        san={limits.san}
        totalBuyVol={orderBook.totalBuyVol}
        totalSellVol={orderBook.totalSellVol}
        quoteVolume={quoteVolume}
      />
    </div>
  );
}
