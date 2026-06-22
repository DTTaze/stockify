"use client";

import { Calendar, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/providers/LanguageProvider";

interface HeroPredictionCardProps {
  activePrediction: {
    label: string;
    price: number;
    confidence: number;
    change: number;
    trend: string;
  } | null;
}

export function HeroPredictionCard({
  activePrediction,
}: HeroPredictionCardProps) {
  const { t } = useLanguage();
  if (!activePrediction) {
    return null;
  }

  const isUp = activePrediction.trend === "UP";

  return (
    <Card className="border-gray-250 flex flex-col justify-between gap-0 rounded-xl border bg-gray-50/40 p-5 md:col-span-2 dark:border-slate-800 dark:bg-slate-900/40">
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
          <Badge variant={isUp ? "success" : "destructive"}>
            {isUp ? (
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {t("priceUp")}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> {t("priceDown")}
              </span>
            )}
          </Badge>
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
    </Card>
  );
}
