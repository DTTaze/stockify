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
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/30 p-4 sm:flex-row">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Hiển thị</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-700 outline-hidden hover:border-gray-300"
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
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white p-0 shadow-xs hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </ButtonCustom>

          {/* First */}
          <ButtonCustom
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              "h-8 cursor-pointer rounded-lg border px-2 text-xs font-semibold shadow-xs transition-all",
              currentPage === 1
                ? "border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            First
          </ButtonCustom>

          {/* Page Numbers */}
          {getPageNumbers(currentPage, totalPages).map((p) => {
            if (p.value === "...") {
              return (
                <span key={p.key} className="px-1 text-gray-400 select-none">
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
                    ? "bg-brand-900 text-white shadow-xs"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
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
                ? "border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            Last
          </ButtonCustom>

          {/* Next */}
          <ButtonCustom
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white p-0 shadow-xs hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </ButtonCustom>
        </div>
      )}
    </div>
  );
}
