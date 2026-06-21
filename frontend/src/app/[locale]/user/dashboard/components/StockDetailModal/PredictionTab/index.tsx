"use client";

import {
  BrainCircuit,
  Calendar,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLanguage } from "@/providers/LanguageProvider";
import { StockPrediction } from "@/types/stock/stock.type";

interface PredictionTabProps {
  symbol: string;
  isModelTrained: boolean;
  isPredictLoading: boolean;
  prediction: StockPrediction | null | undefined;
  selectedHorizon: "tomorrow" | "day3" | "day7" | "day14";
  setSelectedHorizon: (h: "tomorrow" | "day3" | "day7" | "day14") => void;
  activePrediction: {
    label: string;
    price: number;
    confidence: number;
    change: number;
    trend: string;
  } | null;
  forecastChartData: Array<{ name: string; price: number; confidence: number }>;
}

export function PredictionTab({
  symbol,
  isModelTrained,
  isPredictLoading,
  prediction,
  selectedHorizon,
  setSelectedHorizon,
  activePrediction,
  forecastChartData,
}: PredictionTabProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isModelTrained) {
    return (
      <div className="text-yellow-405 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm">
        <BrainCircuit className="text-yellow-405 mb-3 h-8 w-8" />
        <strong className="mb-1 block text-base">
          {t("prediction.notTrainedTitle")}
        </strong>
        {t("prediction.notTrainedDesc", { symbol })}
      </div>
    );
  }

  if (isPredictLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-lg border border-slate-800 bg-slate-900/60" />
    );
  }

  if (!prediction) {
    return (
      <div className="border-gray-250 rounded-lg border bg-gray-50/40 p-5 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        {t("prediction.loadModelError")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-2">
      {/* Horizon selectors */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-900 pb-2">
        {(["tomorrow", "day3", "day7", "day14"] as const).map((horizon) => {
          const labels = {
            tomorrow: t("tomorrow"),
            day3: t("prediction.days3"),
            day7: t("prediction.days7"),
            day14: t("prediction.days14"),
          };
          const isActive = selectedHorizon === horizon;
          return (
            <button
              key={horizon}
              onClick={() => setSelectedHorizon(horizon)}
              className={`cursor-pointer rounded px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-105 dark:text-slate-405 dark:hover:bg-slate-850 text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:bg-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {labels[horizon]}
            </button>
          );
        })}
      </div>

      {/* Hero Prediction Detail Card & Trend Chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {activePrediction && (
          <div className="border-gray-250 flex flex-col justify-between rounded-xl border bg-gray-50/40 p-5 md:col-span-2 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t("prediction.expectedLabel", {
                      label: activePrediction.label,
                    })}
                  </span>
                </div>
                {activePrediction.trend === "UP" ? (
                  <span className="bg-green-105 inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" /> {t("priceUp")}
                  </span>
                ) : (
                  <span className="bg-red-105 dark:text-red-455 inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/10">
                    <TrendingDown className="h-3.5 w-3.5" /> {t("priceDown")}
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                <div className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                  {(activePrediction.price * 1000).toLocaleString("vi-VN")} ₫
                </div>
                <div
                  className={`mt-1 text-sm font-bold ${
                    activePrediction.change >= 0
                      ? "text-green-650 dark:text-green-400"
                      : "text-red-655 dark:text-red-455"
                  }`}
                >
                  {activePrediction.change >= 0 ? "+" : ""}
                  {activePrediction.change.toFixed(2)}% {t("vsCurrent")}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-slate-800/80">
              <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="text-purple-605 h-4 w-4 dark:text-purple-400" />
                  <span>{t("confidence")}</span>
                </div>
                <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                  {activePrediction.confidence}%
                </span>
              </div>
              <div className="bg-gray-150 h-2 overflow-hidden rounded-full dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${activePrediction.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="dark:bg-slate-955/20 rounded-xl border border-gray-200 bg-gray-50/20 p-4 md:col-span-3 dark:border-slate-900">
          <span className="dark:text-slate-550 mb-3 block text-xs font-bold tracking-wider text-gray-500 uppercase">
            {t("prediction.trendLine")}
          </span>
          {isMounted ? (
            <ResponsiveContainer width="100%" height={160} minWidth={0}>
              <LineChart data={forecastChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#c084fc", strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-gray-105 h-[160px] w-full animate-pulse rounded dark:bg-slate-900/40" />
          )}
        </div>
      </div>

      {/* Warning disclaimer */}
      <div className="dark:border-brand-900/30 flex items-start space-x-3 rounded-xl border border-blue-500/10 bg-blue-50/50 p-4 dark:bg-blue-500/5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
        <div>
          <p className="text-indigo-655 text-xs font-bold dark:text-indigo-300">
            {t("disclaimerTitle")}
          </p>
          <p className="text-gray-550 dark:text-slate-405 mt-0.5 text-[10px]">
            {t("disclaimerDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
