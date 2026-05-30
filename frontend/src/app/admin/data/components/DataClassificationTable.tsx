import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/utils";

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    pages.push(totalPages);
  }
  return pages;
}

type Props = {
  stocks: any[];
  total: number;
  isLoading: boolean;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeGroup: string;
  onGroupChange: (group: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
};

const TABS = [
  { id: "HOSE", label: "Sàn HOSE" },
  { id: "VN30", label: "Chỉ số VN30" },
  { id: "HNX", label: "Sàn HNX" },
  { id: "UPCOM", label: "Sàn UPCOM" },
  { id: "CW", label: "Chứng quyền (CW)" },
  { id: "ETF", label: "Quỹ ETF" },
  { id: "FU_INDEX", label: "Hợp đồng tương lai" },
];

export function DataClassificationTable({
  stocks,
  total,
  isLoading,
  search,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  activeGroup,
  onGroupChange,
  limit,
  onLimitChange,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardContent className="p-0">
        {/* Tabs for Group filtering */}
        <div className="flex flex-wrap gap-1 border-b border-gray-100 bg-gray-50/30 p-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onGroupChange(tab.id)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                activeGroup === tab.id
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm mã chứng khoán hoặc tên công ty..."
              value={search}
              onChange={onSearchChange}
              className="border-gray-200 bg-white pl-9"
            />
          </div>
          <div className="text-xs font-medium text-gray-500">
            Tổng số: <span className="text-brand-900 font-bold">{total}</span>{" "}
            mã
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-900 hover:bg-brand-900 border-b-0 text-white">
                <TableHead className="p-4 text-sm font-semibold tracking-wider text-white uppercase">
                  Mã CK
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  Tên công ty
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  Sàn giao dịch
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  Nhóm chỉ số
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  Phân loại
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-400"
                  >
                    Đang tải danh sách...
                  </TableCell>
                </TableRow>
              ) : stocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-400"
                  >
                    Không tìm thấy kết quả nào.
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock: any) => (
                  <TableRow key={stock.symbol} className="hover:bg-gray-50/50">
                    <TableCell className="text-brand-900 p-4 font-bold">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {stock.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50/50 text-blue-700"
                      >
                        {stock.exchange}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {stock.indexGroup ? (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-700"
                        >
                          {stock.indexGroup}
                        </Badge>
                      ) : (
                        <span className="font-normal text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 capitalize">
                      {stock.type || "stock"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
              {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1 text-gray-400 select-none"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <ButtonCustom
                    key={`page-${p}`}
                    onClick={() => onPageChange(p as number)}
                    className={cn(
                      "h-8 w-8 cursor-pointer rounded-lg text-xs font-semibold transition-all",
                      currentPage === p
                        ? "bg-brand-900 text-white shadow-xs"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    {p}
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
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white p-0 shadow-xs hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </ButtonCustom>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
