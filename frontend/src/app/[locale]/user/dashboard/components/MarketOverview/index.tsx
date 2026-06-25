import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import React, { useState } from "react";

import { useMarketOverview } from "./hooks/useMarketOverview";
import { MiniChartCard } from "./MiniChartCard";
import { SummaryTable } from "./SummaryTable";

export function MarketOverview() {
  const [isOpen, setIsOpen] = useState(true);
  const { isLoading, dataList, t } = useMarketOverview();
  const [selectedLabels, setSelectedLabels] = useState([
    { id: "slot-0", label: "VNINDEX" },
    { id: "slot-1", label: "VN30" },
    { id: "slot-2", label: "HNX30" },
    { id: "slot-3", label: "VNXALL" },
  ]);

  if (isLoading) {
    return (
      <div className="border-gray-250 dark:text-slate-505 w-full animate-pulse rounded-xl border bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase dark:border-slate-900 dark:bg-slate-950">
        {t("loadingMarketOverview")}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#0d0e12]">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 transition-colors select-none hover:bg-gray-100 dark:border-slate-800 dark:bg-[#161720] dark:hover:bg-[#1a1b25]"
      >
        <div className="flex items-center gap-2">
          <Settings className="animate-spin-slow h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
            {t("marketIndicesChart")}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span>{t("realtimeFeed")}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 items-start gap-4 p-3 lg:grid-cols-12">
          {/* Left panel: 4 mini-charts (Spans 8 columns) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-2">
            {selectedLabels.map((slot, index) => {
              const item =
                dataList.find((d) => d.label === slot.label) || dataList[0];
              return (
                <MiniChartCard
                  key={slot.id}
                  item={item}
                  allIndices={dataList}
                  onSelect={(newLabel) => {
                    const updated = [...selectedLabels];
                    updated[index] = { ...updated[index], label: newLabel };
                    setSelectedLabels(updated);
                  }}
                />
              );
            })}
          </div>

          {/* Right panel: Summary Table (Spans 4 columns) */}
          <SummaryTable dataList={dataList} />
        </div>
      )}
    </div>
  );
}
