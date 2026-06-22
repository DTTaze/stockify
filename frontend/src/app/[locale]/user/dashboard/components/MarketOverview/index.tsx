import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import React, { useState } from "react";

import { useMarketOverview } from "./hooks/useMarketOverview";
import { MiniChartCard } from "./MiniChartCard";
import { SummaryTable } from "./SummaryTable";

export function MarketOverview() {
  const [isOpen, setIsOpen] = useState(true);
  const { isLoading, dataList, t } = useMarketOverview();

  if (isLoading) {
    return (
      <div className="border-gray-250 dark:text-slate-505 w-full animate-pulse rounded-xl border bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase dark:border-slate-900 dark:bg-slate-950">
        {t("loadingMarketOverview")}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50/80 px-4 py-2 transition-colors select-none hover:bg-gray-100 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:bg-slate-900"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-gray-750 dark:text-slate-355 text-xs font-bold tracking-wider uppercase">
            {t("marketIndicesChart")}
          </span>
        </div>
        <div className="text-gray-550 dark:text-slate-505 flex items-center gap-4 text-[10px] font-bold">
          <span>{t("realtimeFeed")}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 gap-4 p-3 lg:grid-cols-12">
          {/* Left panel: 4 mini-charts (Spans 8 columns) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4">
            {dataList.slice(0, 4).map((item) => (
              <MiniChartCard key={item.label} item={item} />
            ))}
          </div>

          {/* Right panel: Summary Table (Spans 4 columns) */}
          <SummaryTable dataList={dataList} />
        </div>
      )}
    </div>
  );
}
