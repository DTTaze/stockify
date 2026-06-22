"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/providers/LanguageProvider";

interface PredictionHorizonSelectorProps {
  selectedHorizon: "tomorrow" | "day3" | "day7" | "day14";
  setSelectedHorizon: (h: "tomorrow" | "day3" | "day7" | "day14") => void;
}

export function PredictionHorizonSelector({
  selectedHorizon,
  setSelectedHorizon,
}: PredictionHorizonSelectorProps) {
  const { t } = useLanguage();
  const horizons = ["tomorrow", "day3", "day7", "day14"] as const;

  const labels = {
    tomorrow: t("tomorrow"),
    day3: t("prediction.days3"),
    day7: t("prediction.days7"),
    day14: t("prediction.days14"),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
        {t("prediction.forecastHorizon") || "Khoảng dự báo"}
      </span>
      <div className="flex gap-1 overflow-x-auto">
        {horizons.map((horizon) => {
          const isActive = selectedHorizon === horizon;
          return (
            <Button
              key={horizon}
              size="xs"
              variant={isActive ? "default" : "outline"}
              onClick={() => setSelectedHorizon(horizon)}
              className={`cursor-pointer font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "border-transparent bg-purple-600 text-white shadow hover:bg-purple-700"
                  : "text-gray-600 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {labels[horizon]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
