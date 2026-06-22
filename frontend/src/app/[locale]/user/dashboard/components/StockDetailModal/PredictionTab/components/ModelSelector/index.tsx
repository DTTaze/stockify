"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/providers/LanguageProvider";

interface ModelSelectorProps {
  modelType: string;
  setModelType: (t: string) => void;
}

export function ModelSelector({ modelType, setModelType }: ModelSelectorProps) {
  const { t } = useLanguage();
  const types = ["best", "lstm", "xgboost", "transformer"] as const;

  const labels = {
    best: "Tự động (AI Auto)",
    lstm: "Mô hình LSTM",
    xgboost: "Mô hình XGBoost",
    transformer: "Mô hình Transformer",
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
        {t("prediction.modelArchitecture")}
      </span>
      <div className="flex gap-1 overflow-x-auto">
        {types.map((type) => {
          const isActive = modelType === type;
          return (
            <Button
              key={type}
              size="xs"
              variant={isActive ? "default" : "outline"}
              onClick={() => setModelType(type)}
              className={`cursor-pointer font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-700"
                  : "text-gray-600 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {labels[type]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
