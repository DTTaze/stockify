import { Settings } from "lucide-react";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useLanguage } from "@/providers/LanguageProvider";

import { MarketOverviewDataType } from "./hooks/useMarketOverview";
import { getPriceColor } from "./utils";

interface SummaryTableProps {
  dataList: MarketOverviewDataType[];
}

export function SummaryTable({ dataList }: SummaryTableProps) {
  const { t } = useLanguage();

  return (
    <div className="no-scrollbar flex max-h-[305px] flex-col justify-between overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 lg:col-span-4 dark:border-slate-800 dark:bg-[#08090d]">
      <Table
        classNameWrapper="w-full overflow-x-auto"
        className="w-full min-w-[390px] border-collapse text-left font-sans text-[10px] font-semibold select-none"
      >
        <TableHeader>
          <TableRow className="border-b border-gray-200 text-[9px] tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
            <TableHead className="flex items-center gap-0.5 pb-1.5 pl-0.5 font-bold text-slate-500 dark:text-slate-400">
              <Settings className="animate-spin-slow h-3 w-3 text-slate-500" />{" "}
              {t("index")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold text-slate-500 dark:text-slate-400">
              {t("points")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold text-slate-500 dark:text-slate-400">
              {"< +/- >"}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold text-slate-500 dark:text-slate-400">
              {t("volumeMillion")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold text-slate-500 dark:text-slate-400">
              {t("valueBillion")}
            </TableHead>
            <TableHead className="px-1 pb-1.5 text-center font-bold text-slate-500 dark:text-slate-400">
              {t("stocksChange")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-gray-250/60 divide-y dark:divide-slate-900/60">
          {dataList.map((item) => {
            return (
              <TableRow
                key={item.label}
                className="border-b border-gray-200/50 transition-colors hover:bg-gray-100/50 dark:border-slate-900/40 dark:hover:bg-[#161720]"
              >
                <TableCell className="py-2.5 pl-0.5 font-mono text-[10.5px] font-bold text-slate-800 dark:text-slate-100">
                  {item.label}
                </TableCell>
                <TableCell
                  className={`py-2.5 text-right font-mono text-[10.5px] font-bold ${getPriceColor(
                    item.change,
                  )}`}
                >
                  {item.price.toLocaleString("vi-VN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell
                  className={`py-2.5 text-right font-mono text-[10.5px] font-bold ${getPriceColor(
                    item.change,
                  )}`}
                >
                  {item.diff > 0 ? "+" : ""}
                  {item.diff.toFixed(2)}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono text-[10px] text-slate-600 dark:text-slate-300">
                  {(item.volume / 1_000_000).toLocaleString("vi-VN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono text-[10px] text-slate-600 dark:text-slate-300">
                  {item.stats.valueBillion.toLocaleString("vi-VN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </TableCell>
                <TableCell className="py-2.5 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 font-mono text-[9px] font-bold">
                    <span className="text-[#22c55e]">↑ {item.stats.up}</span>
                    <span className="text-[#eab308]">▬ {item.stats.flat}</span>
                    <span className="text-[#ef4444]">↓ {item.stats.down}</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
