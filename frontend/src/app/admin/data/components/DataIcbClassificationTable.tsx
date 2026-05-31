import { Search } from "lucide-react";
import React from "react";

import { IcbIndustrySelect } from "@/components/common/IcbIndustrySelect";
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
import { ClassificationStock, IcbIndustry } from "@/types/stock/stock.type";

import { ClassificationTablePagination } from "./ClassificationTablePagination";

type Props = {
  industries: IcbIndustry[];
  stocks: ClassificationStock[];
  total: number;
  isLoading: boolean;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeIcbCode: string;
  onIcbChange: (code: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export function DataIcbClassificationTable({
  industries,
  stocks,
  total,
  isLoading,
  search,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  activeIcbCode,
  onIcbChange,
  limit,
  onLimitChange,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardContent className="p-0">
        {/* Industry Filters */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
            {/* Custom Searchable Hierarchical Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-900 text-[10px] font-bold tracking-wider uppercase">
                Chọn Ngành ICB
              </label>
              <IcbIndustrySelect
                industries={industries}
                activeIcbCode={activeIcbCode}
                onChange={onIcbChange}
                isLoading={isLoading}
              />
            </div>

            {/* Search stock code / company name */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Tìm kiếm mã hoặc tên công ty
                </label>
                <div className="text-xs font-medium text-gray-500">
                  Tổng số:{" "}
                  <span className="text-brand-900 font-bold">{total}</span> mã
                </div>
              </div>
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nhập mã chứng khoán hoặc tên công ty..."
                  value={search}
                  onChange={onSearchChange}
                  className="focus-visible:ring-brand-900 h-9 border-gray-200 bg-white pl-9"
                />
              </div>
            </div>
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
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                  </TableRow>
                ))
              ) : stocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
