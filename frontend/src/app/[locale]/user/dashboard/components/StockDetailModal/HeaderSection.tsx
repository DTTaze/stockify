import { X } from "lucide-react";
import React from "react";

interface HeaderSectionProps {
  symbol: string;
  companyName: string;
  exchange: string;
  onClose: () => void;
}

export function HeaderSection({
  symbol,
  companyName,
  exchange,
  onClose,
}: HeaderSectionProps) {
  return (
    <div className="dark:border-slate-905 flex flex-col gap-3 border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-gray-105 rounded border border-gray-200 px-2.5 py-1 text-sm font-bold text-gray-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {symbol}
          </span>
          <span className="dark:text-slate-550 text-xs tracking-wide text-gray-500 uppercase">
            ({exchange}) - {companyName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              window.open(
                `https://fireant.vn/dashboard/symbol/${symbol.toUpperCase()}`,
                "_blank",
              )
            }
            className="bg-gray-105 dark:hover:bg-slate-850 dark:text-slate-350 cursor-pointer rounded border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-200 dark:border-slate-800 dark:bg-slate-900"
          >
            Phân tích cơ bản
          </button>
          <button
            onClick={onClose}
            className="hover:text-gray-750 dark:text-slate-450 bg-gray-105 dark:hover:bg-slate-850 cursor-pointer rounded border border-gray-200 p-1 text-gray-500 transition-all hover:bg-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
