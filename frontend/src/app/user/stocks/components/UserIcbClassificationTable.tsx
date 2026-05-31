import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React from "react";

import { ButtonCustom } from "@/components/common/form/button";
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

type Props = {
  icbIndustries: IcbIndustry[];
  activeIcbCode: string;
  icbSearch: string;
  icbPage: number;
  icbStocks: ClassificationStock[];
  icbTotal: number;
  icbTotalPages: number;
  isIcbLoading: boolean;
  isIcbIndustriesLoading: boolean;
  onIcbTabChange: (code: string) => void;
  onIcbSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIcbPageChange: React.Dispatch<React.SetStateAction<number>>;
};

export function UserIcbClassificationTable({
  icbIndustries,
  activeIcbCode,
  icbSearch,
  icbPage,
  icbStocks,
  icbTotal,
  icbTotalPages,
  isIcbLoading,
  isIcbIndustriesLoading,
  onIcbTabChange,
  onIcbSearch,
  onIcbPageChange,
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
                industries={icbIndustries}
                activeIcbCode={activeIcbCode}
                onChange={onIcbTabChange}
                isLoading={isIcbIndustriesLoading}
              />
            </div>

            {/* Search stock code / company name */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Tìm kiếm mã hoặc tên công ty
                </label>
                <div className="text-xs font-medium text-gray-500">
                  Tìm thấy:{" "}
                  <span className="text-brand-900 font-bold">{icbTotal}</span>{" "}
                  mã
                </div>
              </div>
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nhập mã chứng khoán hoặc tên công ty..."
                  value={icbSearch}
                  onChange={onIcbSearch}
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
              {isIcbLoading ? (
                ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((rowKey) => (
                  <TableRow key={rowKey}>
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
              ) : icbStocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-gray-400"
                  >
                    Không tìm thấy mã chứng khoán nào trong ngành này.
                  </TableCell>
                </TableRow>
              ) : (
                icbStocks.map((stock: ClassificationStock) => (
                  <TableRow key={stock.symbol} className="hover:bg-gray-50/50">
                    <TableCell className="text-brand-900 p-4 font-bold">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {stock.name || stock.organName || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50/50 text-blue-700"
                      >
                        {stock.exchange}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 capitalize">
                        {stock.type || "stock"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {icbTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-4">
            <div className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-900">{icbPage}</span>{" "}
              /{" "}
              <span className="font-medium text-gray-900">{icbTotalPages}</span>
            </div>
            <div className="flex gap-2">
              <ButtonCustom
                onClick={() => onIcbPageChange((p) => Math.max(1, p - 1))}
                disabled={icbPage === 1}
                className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() =>
                  onIcbPageChange((p) => Math.min(icbTotalPages, p + 1))
                }
                disabled={icbPage === icbTotalPages}
                className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </ButtonCustom>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
