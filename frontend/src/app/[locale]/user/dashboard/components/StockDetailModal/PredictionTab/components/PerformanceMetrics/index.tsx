"use client";

import React from "react";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/providers/LanguageProvider";

interface PerformanceMetricsProps {
  metrics:
    | {
        accuracy: number;
        rmse: number;
        mae: number;
        mape: number;
      }
    | null
    | undefined;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const { t } = useLanguage();
  if (!metrics) {
    return null;
  }

  return (
    <Card className="gap-0 rounded-xl border border-gray-200 bg-gray-50/20 p-5 py-5 dark:border-slate-800 dark:bg-slate-900/10">
      <span className="mb-3 block text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-slate-400">
        {t("prediction.performanceMetrics") || "Hiệu suất mô hình (Validation)"}
      </span>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
            Accuracy (Độ chính xác)
          </span>
          <div className="mt-1 text-xl font-extrabold text-green-600 dark:text-green-400">
            {metrics.accuracy ? `${metrics.accuracy.toFixed(2)}%` : "N/A"}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
            MAE (Sai số tuyệt đối TB)
          </span>
          <div className="mt-1 text-xl font-extrabold text-gray-800 dark:text-slate-200">
            {metrics.mae ? `${metrics.mae.toFixed(2)}` : "N/A"}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
            RMSE (Độ lệch chuẩn sai số)
          </span>
          <div className="mt-1 text-xl font-extrabold text-gray-800 dark:text-slate-200">
            {metrics.rmse ? `${metrics.rmse.toFixed(2)}` : "N/A"}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
            MAPE (Sai số phần trăm TB)
          </span>
          <div className="mt-1 text-xl font-extrabold text-gray-800 dark:text-slate-200">
            {metrics.mape ? `${metrics.mape.toFixed(2)}%` : "N/A"}
          </div>
        </div>
      </div>
    </Card>
  );
}
