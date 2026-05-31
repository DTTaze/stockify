import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React from "react";

import { ButtonCustom } from "@/components/common/form/button";
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
import { cn } from "@/utils";

const MARKET_TABS = [
  { id: "HOSE", label: "Sàn HOSE" },
  { id: "VN30", label: "Chỉ số VN30" },
  { id: "HNX", label: "Sàn HNX" },
  { id: "UPCOM", label: "Sàn UPCOM" },
  { id: "CW", label: "Chứng quyền (CW)" },
  { id: "ETF", label: "Quỹ ETF" },
];

import { ClassificationStock } from "@/types/stock/stock.type";

type Props = {
  activeMarketTab: string;
  marketSearch: string;
  marketPage: number;
  marketStocks: ClassificationStock[];
  marketTotal: number;
  marketTotalPages: number;
  isMarketLoading: boolean;
  onMarketTabChange: (tabId: string) => void;
  onMarketSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMarketPageChange: React.Dispatch<React.SetStateAction<number>>;
};

export function UserMarketClassificationTable({
  activeMarketTab,
  marketSearch,
  marketPage,
  marketStocks,
  marketTotal,
  marketTotalPages,
  isMarketLoading,
  onMarketTabChange,
  onMarketSearch,
  onMarketPageChange,
}: Props) {
  return (
    <>
      {/* Market Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border-b border-gray-200 bg-white p-2 shadow-xs">
        {MARKET_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onMarketTabChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeMarketTab === tab.id
                ? "bg-brand-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Table */}
      <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm mã chứng khoán hoặc tên công ty..."
                value={marketSearch}
                onChange={onMarketSearch}
                className="focus-visible:ring-brand-900 border-gray-200 bg-white pl-9"
              />
            </div>
            <div className="text-xs font-medium text-gray-500">
              Tìm thấy{" "}
              <span className="text-brand-900 font-bold">{marketTotal}</span> mã
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
                {isMarketLoading ? (
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
                        <Skeleton className="h-5 w-16 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-12" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : marketStocks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-400"
                    >
                      Không tìm thấy mã chứng khoán nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  marketStocks.map((stock: ClassificationStock) => (
                    <TableRow
                      key={stock.symbol}
                      className="hover:bg-gray-50/50"
                    >
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
                      <TableCell className="font-medium text-gray-600">
                        {stock.indexGroup ? (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700"
                          >
                            {stock.indexGroup}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
          {marketTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-4">
              <div className="text-sm text-gray-500">
                Trang{" "}
                <span className="font-medium text-gray-900">{marketPage}</span>{" "}
                /{" "}
                <span className="font-medium text-gray-900">
                  {marketTotalPages}
                </span>
              </div>
              <div className="flex gap-2">
                <ButtonCustom
                  onClick={() => onMarketPageChange((p) => Math.max(1, p - 1))}
                  disabled={marketPage === 1}
                  className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </ButtonCustom>
                <ButtonCustom
                  onClick={() =>
                    onMarketPageChange((p) => Math.min(marketTotalPages, p + 1))
                  }
                  disabled={marketPage === marketTotalPages}
                  className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </ButtonCustom>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
