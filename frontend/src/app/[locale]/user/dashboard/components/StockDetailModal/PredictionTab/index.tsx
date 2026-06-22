"use client";

import { BrainCircuit } from "lucide-react";
import React from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/providers/LanguageProvider";
import { StockPrediction } from "@/types/stock/stock.type";

import { HeroPredictionCard } from "./components/HeroPredictionCard";
import { ModelSelector } from "./components/ModelSelector";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { PredictionChart } from "./components/PredictionChart";
import { PredictionHorizonSelector } from "./components/PredictionHorizonSelector";
import { WarningDisclaimer } from "./components/WarningDisclaimer";

interface PredictionTabProps {
  symbol: string;
  isModelTrained: boolean;
  isPredictLoading: boolean;
  prediction: StockPrediction | null | undefined;
  modelType: string;
  setModelType: (t: string) => void;
  selectedHorizon: "tomorrow" | "day3" | "day7" | "day14";
  setSelectedHorizon: (h: "tomorrow" | "day3" | "day7" | "day14") => void;
  activePrediction: {
    label: string;
    price: number;
    confidence: number;
    change: number;
    trend: string;
  } | null;
  forecastChartData: Array<{
    name: string;
    actual?: number;
    predicted?: number;
    confidence?: number;
  }>;
}

export function PredictionTab({
  symbol,
  isModelTrained,
  isPredictLoading,
  prediction,
  modelType,
  setModelType,
  selectedHorizon,
  setSelectedHorizon,
  activePrediction,
  forecastChartData,
}: PredictionTabProps) {
  const { t } = useLanguage();

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
      <div className="space-y-4 py-2">
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-900">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <Skeleton className="h-48 rounded-xl md:col-span-2" />
          <Skeleton className="h-48 rounded-xl md:col-span-3" />
        </div>
      </div>
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
      {/* Selector Toolbar */}
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-900">
        <PredictionHorizonSelector
          selectedHorizon={selectedHorizon}
          setSelectedHorizon={setSelectedHorizon}
        />
        <ModelSelector modelType={modelType} setModelType={setModelType} />
      </div>

      {/* Hero Prediction Detail Card & Trend Chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <HeroPredictionCard activePrediction={activePrediction} />
        <PredictionChart
          forecastChartData={forecastChartData}
          isMounted={true}
        />
      </div>

      {/* Model Performance Metrics Panel */}
      <PerformanceMetrics metrics={prediction.metrics} />

      {/* Warning disclaimer */}
      <WarningDisclaimer />
    </div>
  );
}
