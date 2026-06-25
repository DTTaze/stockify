"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

type StocksPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages = new Set([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }

  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  return [...pages].sort((first, second) => first - second);
};

export function StocksPagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 15, 25, 50],
  onPageChange,
  onPageSizeChange,
}: StocksPaginationProps) {
  const { t } = useLanguage();
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    onPageChange(Math.min(totalPages, Math.max(1, page)));
  };

  return (
    <div className="border-border bg-muted/30 flex flex-col gap-3 border-t p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
        <span>
          {t("stocks.pageIndicator", {
            current: currentPage,
            total: totalPages,
          })}
        </span>

        <label className="flex items-center gap-2">
          <span>{t("stocks.pageSize")}</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="border-border bg-card text-foreground focus:border-brand-700 dark:focus:border-brand-400 h-9 rounded-lg border px-2 text-sm font-medium transition-colors outline-none"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ButtonCustom
          onClick={() => goToPage(1)}
          disabled={!canGoPrevious}
          className="border-border bg-card hover:bg-muted text-muted-foreground h-9 cursor-pointer rounded-lg border px-3 text-xs font-semibold shadow-xs disabled:opacity-50"
        >
          {t("stocks.firstPage")}
        </ButtonCustom>

        <ButtonCustom
          onClick={() => goToPage(currentPage - 1)}
          disabled={!canGoPrevious}
          className="border-border bg-card hover:bg-muted h-9 cursor-pointer rounded-lg border px-2 shadow-xs disabled:opacity-50"
          title={t("stocks.previousPage")}
        >
          <ChevronLeft className="text-muted-foreground h-4 w-4" />
        </ButtonCustom>

        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldShowGap = previousPage && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {shouldShowGap && (
                <span className="text-muted-foreground px-1 text-sm font-semibold">
                  ...
                </span>
              )}
              <button
                onClick={() => goToPage(page)}
                className={cn(
                  "h-9 min-w-9 cursor-pointer rounded-lg border px-3 text-sm font-semibold transition-colors",
                  page === currentPage
                    ? "border-brand-900 bg-brand-900 dark:border-brand-700 dark:bg-brand-700 text-white"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {page}
              </button>
            </div>
          );
        })}

        <ButtonCustom
          onClick={() => goToPage(currentPage + 1)}
          disabled={!canGoNext}
          className="border-border bg-card hover:bg-muted h-9 cursor-pointer rounded-lg border px-2 shadow-xs disabled:opacity-50"
          title={t("stocks.nextPage")}
        >
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </ButtonCustom>

        <ButtonCustom
          onClick={() => goToPage(totalPages)}
          disabled={!canGoNext}
          className="border-border bg-card hover:bg-muted text-muted-foreground h-9 cursor-pointer rounded-lg border px-3 text-xs font-semibold shadow-xs disabled:opacity-50"
        >
          {t("stocks.lastPage")}
        </ButtonCustom>
      </div>
    </div>
  );
}
