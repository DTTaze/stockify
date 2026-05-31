import { Search } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ClassificationStock } from "@/types/stock/stock.type";
import { cn } from "@/utils";

import { ClassificationTablePagination } from "./ClassificationTablePagination";

type Props = {
  stocks: ClassificationStock[];
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
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-4">
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-14 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                  </TableRow>
                ))
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
                stocks.map((stock: ClassificationStock) => (
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
        <ClassificationTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </CardContent>
    </Card>
  );
}
