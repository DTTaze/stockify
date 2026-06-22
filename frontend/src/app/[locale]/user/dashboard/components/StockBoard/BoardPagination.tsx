import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/providers/LanguageProvider";

interface BoardPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function BoardPagination({
  currentPage,
  totalPages,
  totalItems,
  setCurrentPage,
}: BoardPaginationProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/80 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/30">
      <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase dark:text-slate-400">
        {t("page")}{" "}
        <strong className="text-gray-850 dark:text-slate-200">
          {currentPage}
        </strong>{" "}
        / {totalPages} ({totalItems} {t("totalStocks")})
      </span>
      <div className="flex gap-1.5">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="icon-xs"
          className="border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-slate-400" />
        </Button>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="icon-xs"
          className="border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-slate-400" />
        </Button>
      </div>
    </div>
  );
}
