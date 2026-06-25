import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { cn } from "@/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
};

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: { value: number | string; key: string }[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ value: i, key: `page-${i}` });
    }
  } else {
    pages.push({ value: 1, key: "page-1" });
    if (currentPage > 3) {
      pages.push({ value: "...", key: "ellipsis-start" });
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push({ value: i, key: `page-${i}` });
      }
    }
    if (currentPage < totalPages - 2) {
      pages.push({ value: "...", key: "ellipsis-end" });
    }
    pages.push({ value: totalPages, key: `page-${totalPages}` });
  }
  return pages;
}

export function UserTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
      {/* Page Size Selector */}
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Hiển thị</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border-border bg-card text-foreground cursor-pointer rounded-lg border px-2 py-1 text-sm font-medium outline-hidden transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>dòng / trang</span>
      </div>

      {/* Page Numbers with First/Last */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          {/* Prev */}
          <ButtonCustom
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-border bg-card hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0 shadow-xs disabled:opacity-50"
          >
            <ChevronLeft className="text-muted-foreground h-4 w-4" />
          </ButtonCustom>

          {/* First */}
          <ButtonCustom
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              "h-8 cursor-pointer rounded-lg border px-2 text-xs font-semibold shadow-xs transition-all",
              currentPage === 1
                ? "border-border bg-muted text-muted-foreground/50"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            First
          </ButtonCustom>

          {/* Page Numbers */}
          {getPageNumbers(currentPage, totalPages).map((p) => {
            if (p.value === "...") {
              return (
                <span
                  key={p.key}
                  className="text-muted-foreground/60 px-1 select-none"
                >
                  ...
                </span>
              );
            }
            return (
              <ButtonCustom
                key={p.key}
                onClick={() => onPageChange(p.value as number)}
                className={cn(
                  "h-8 w-8 cursor-pointer rounded-lg text-xs font-semibold transition-all",
                  currentPage === p.value
                    ? "bg-brand-900 dark:bg-brand-700 text-white shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground border",
                )}
              >
                {p.value}
              </ButtonCustom>
            );
          })}

          {/* Last */}
          <ButtonCustom
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              "h-8 cursor-pointer rounded-lg border px-2 text-xs font-semibold shadow-xs transition-all",
              currentPage === totalPages
                ? "border-border bg-muted text-muted-foreground/50"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            Last
          </ButtonCustom>

          {/* Next */}
          <ButtonCustom
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-border bg-card hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0 shadow-xs disabled:opacity-50"
          >
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </ButtonCustom>
        </div>
      )}
    </div>
  );
}
