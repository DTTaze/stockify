"use client";

import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { getStatusColor, getStatusDot } from "@/utils/technicalIndicator";

import { IndicatorsType } from "../hooks/useStockDetail";

interface IndicatorsTabProps {
  indicators: IndicatorsType;
  bullishCount: number;
  bearishCount: number;
}

export function IndicatorsTab({
  indicators,
  bullishCount,
  bearishCount,
}: IndicatorsTabProps) {
  const { t } = useLanguage();

  const getDesc = (name: string, fallback: string) => {
    if (name.includes("MA(20)")) {
      return t("indicator.ma20_desc");
    }
    if (name.includes("EMA(50)")) {
      return t("indicator.ema50_desc");
    }
    if (name.includes("RSI")) {
      return t("indicator.rsi_desc");
    }
    if (name.includes("MACD")) {
      return t("indicator.macd_desc");
    }
    return fallback;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {indicators.map((indicator) => {
          const Icon = indicator.icon;
          return (
            <div
              key={indicator.name}
              className="bg-gray-55/30 flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-slate-900 dark:bg-slate-900/20"
            >
              <div className="flex items-center space-x-3.5">
                <div className="bg-gray-105 dark:bg-slate-850 rounded-lg p-2">
                  <Icon className="dark:text-slate-350 h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 dark:text-slate-100">
                    <span>{indicator.name}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDot(indicator.status)}`}
                    />
                  </div>
                  <span className="text-gray-550 mt-0.5 block text-[10px] dark:text-slate-500">
                    {getDesc(indicator.name, indicator.description)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-gray-800 dark:text-slate-200">
                  {indicator.value}
                </div>
                <span
                  className={`mt-1 inline-block rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusColor(
                    indicator.status,
                  )}`}
                >
                  {t(`indicator.status.${indicator.status.toUpperCase()}`)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-gray-205 dark:border-slate-855 text-gray-555 dark:text-slate-450 mt-4 rounded-xl border bg-gray-50/50 p-4 text-xs dark:bg-slate-900/30">
        <strong className="mb-1 block text-gray-800 dark:text-slate-300">
          {t("indicator.summary")}
        </strong>
        {bullishCount} {t("indicator.bullishText")}, {bearishCount}{" "}
        {t("indicator.bearishText")}. {t("indicator.signalDesc")}
      </div>
    </div>
  );
}
