import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";

interface BoardPaginationProps {
  currentPage: number;
  marketTotalPages: number;
  marketTotal: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function BoardPagination({
  currentPage,
  marketTotalPages,
  marketTotal,
  setCurrentPage,
}: BoardPaginationProps) {
  const { t } = useLanguage();

  return (
    <div className="border-gray-250 flex items-center justify-between border-t bg-gray-50/40 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/20">
      <span className="text-gray-550 text-[9px] font-semibold uppercase dark:text-slate-500">
        {t("page")}{" "}
        <strong className="text-gray-750 dark:text-slate-300">
          {currentPage}
        </strong>{" "}
        / {marketTotalPages} ({marketTotal} {t("totalStocks")})
      </span>
      <div className="flex gap-1">
        <ButtonCustom
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="border-gray-250 flex h-6 w-6 items-center justify-center rounded border bg-white p-0 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:disabled:hover:bg-slate-950"
        >
          <ChevronLeft className="text-gray-505 dark:text-slate-450 h-3.5 w-3.5" />
        </ButtonCustom>
        <ButtonCustom
          onClick={() =>
            setCurrentPage((p) => Math.min(marketTotalPages, p + 1))
          }
          disabled={currentPage === marketTotalPages}
          className="border-gray-250 flex h-6 w-6 items-center justify-center rounded border bg-white p-0 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:disabled:hover:bg-slate-950"
        >
          <ChevronRight className="text-gray-505 dark:text-slate-450 h-3.5 w-3.5" />
        </ButtonCustom>
      </div>
    </div>
  );
}
