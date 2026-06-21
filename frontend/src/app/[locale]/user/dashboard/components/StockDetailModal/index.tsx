import { BrainCircuit, Layers, LineChart as LineIcon } from "lucide-react";
import React, { useEffect } from "react";

import { HeaderSection } from "./HeaderSection";
import { IndicatorsTab } from "./IndicatorsTab";
import { PredictionTab } from "./PredictionTab";
import { QuickQuoteRibbon } from "./QuickQuoteRibbon";
import { TradingTab } from "./TradingTab";
import { SubTab, useStockDetail } from "./useStockDetail";

interface StockDetailModalProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

export function StockDetailModal({
  symbol,
  isOpen,
  onClose,
}: StockDetailModalProps) {
  const {
    activeTab,
    setActiveTab,
    period,
    setPeriod,
    selectedHorizon,
    setSelectedHorizon,
    prediction,
    isHistoryLoading,
    isPredictLoading,
    isModelTrained,
    companyName,
    exchange,
    chartData,
    forecastChartData,
    activePrediction,
    indicators,
    bullishCount,
    bearishCount,
    priceUnit,
    change,
    tc,
    tran,
    san,
    quoteVolume,
    limits,
    orderBook,
    matchHistory,
  } = useStockDetail(symbol, isOpen);

  // Prevent scroll on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
    >
      {/* Modal Main Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="no-scrollbar flex max-h-[92vh] w-full max-w-[1250px] flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* Header Section */}
        <HeaderSection
          symbol={symbol}
          companyName={companyName}
          exchange={exchange}
          onClose={onClose}
        />

        {/* Quick Quote Info Ribbons */}
        <div className="mt-3">
          <QuickQuoteRibbon
            priceUnit={priceUnit}
            change={change}
            tran={tran}
            san={san}
            tc={tc}
            volume={quoteVolume}
          />
        </div>

        {/* Horizontal Dialog Sub-tabs */}
        <div className="mt-2 flex border-b border-gray-200 dark:border-slate-900">
          {[
            { id: "GIAO_DICH", label: "Giao dịch", icon: LineIcon },
            { id: "AI_PREDICT", label: "Dự báo AI", icon: BrainCircuit },
            { id: "INDICATORS", label: "Chỉ báo kỹ thuật", icon: Layers },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SubTab)}
                className={`flex cursor-pointer items-center gap-1.5 border-b-2 px-6 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "text-indigo-505 border-indigo-500 bg-gray-50/50 dark:bg-slate-900/10 dark:text-indigo-400"
                    : "text-gray-550 border-transparent hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Workspace content */}
        <div className="mt-4 flex-1">
          {activeTab === "GIAO_DICH" && (
            <TradingTab
              symbol={symbol}
              exchange={exchange}
              period={period}
              setPeriod={setPeriod}
              isHistoryLoading={isHistoryLoading}
              chartData={chartData}
              limits={limits}
              orderBook={orderBook}
              matchHistory={matchHistory}
              quoteVolume={quoteVolume}
            />
          )}

          {activeTab === "AI_PREDICT" && (
            <PredictionTab
              symbol={symbol}
              isModelTrained={isModelTrained}
              isPredictLoading={isPredictLoading}
              prediction={prediction}
              selectedHorizon={selectedHorizon}
              setSelectedHorizon={setSelectedHorizon}
              activePrediction={activePrediction}
              forecastChartData={forecastChartData}
            />
          )}

          {activeTab === "INDICATORS" && (
            <IndicatorsTab
              indicators={indicators}
              bullishCount={bullishCount}
              bearishCount={bearishCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}
