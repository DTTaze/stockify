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
    <div className="bg-gray-55/50 no-scrollbar flex max-h-[305px] flex-col justify-between overflow-y-auto rounded-lg border border-gray-200 p-2.5 lg:col-span-4 dark:border-slate-900 dark:bg-[#111217]/40">
      <Table
        classNameWrapper="w-full overflow-x-auto"
        className="w-full min-w-[390px] border-collapse text-left font-sans text-[10px] font-semibold select-none"
      >
        <TableHeader>
          <TableRow className="dark:text-slate-505 border-b border-gray-200 text-[9px] tracking-wider text-gray-500 uppercase dark:border-slate-900">
            <TableHead className="dark:text-slate-505 flex items-center gap-0.5 pb-1.5 pl-0.5 font-bold text-gray-500">
              <Settings className="dark:text-slate-505 h-3 w-3 text-gray-400" />{" "}
              {t("index")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold">
              {t("points")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold">
              {"< +/- >"}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold">
              {t("volumeMillion")}
            </TableHead>
            <TableHead className="pb-1.5 text-right font-bold">
              {t("valueBillion")}
            </TableHead>
            <TableHead className="px-1 pb-1.5 text-center font-bold">
              {t("stocksChange")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200/50 dark:divide-slate-900/35">
          {dataList.map((item) => {
            return (
              <TableRow
                key={item.label}
                className="transition-colors hover:bg-gray-100/50 dark:hover:bg-slate-900/20"
              >
                <TableCell className="py-2.5 pl-0.5 font-mono text-[10.5px] text-gray-700 dark:text-slate-300">
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
                <TableCell className="text-gray-550 py-2.5 text-right font-mono text-[10px] dark:text-slate-400">
                  {(item.volume / 1_000_000).toLocaleString("vi-VN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </TableCell>
                <TableCell className="text-gray-650 py-2.5 text-right font-mono text-[10px] dark:text-slate-400">
                  {item.stats.valueBillion.toLocaleString("vi-VN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </TableCell>
                <TableCell className="py-2.5 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 font-mono text-[9px] font-bold">
                    <span className="text-green-600 dark:text-green-400">
                      ↑ {item.stats.up}
                    </span>
                    <span className="text-amber-600 dark:text-yellow-400">
                      ▬ {item.stats.flat}
                    </span>
                    <span className="text-red-600 dark:text-red-500">
                      ↓ {item.stats.down}
                    </span>
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
