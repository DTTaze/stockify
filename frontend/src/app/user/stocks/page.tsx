"use client";

import { ChevronLeft, ChevronRight, Layers, Search } from "lucide-react";
import { useState } from "react";

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
import { useQueryStocks } from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

const TABS = [
  { id: "HOSE", label: "Sàn HOSE" },
  { id: "VN30", label: "Chỉ số VN30" },
  { id: "HNX", label: "Sàn HNX" },
  { id: "UPCOM", label: "Sàn UPCOM" },
  { id: "CW", label: "Chứng quyền (CW)" },
  { id: "ETF", label: "Quỹ ETF" },
];

const ITEMS_PER_PAGE = 15;

export default function UserStocksPage() {
  const [activeTab, setActiveTab] = useState("HOSE");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, isLoading } = useQueryStocks({
    group: activeTab,
    keyword: search.trim() || undefined,
    limit: ITEMS_PER_PAGE,
    offset: offset,
  });

  const stocks = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <Layers className="text-brand-900 h-6 w-6" />
            Danh mục chứng khoán
          </h1>
          <p className="text-sm text-gray-500">
            Tra cứu danh sách mã chứng khoán phân loại theo sàn và chỉ số.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border-b border-gray-200 bg-white p-2 shadow-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-brand-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Table Container */}
      <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <CardContent className="p-0">
          {/* Search bar */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm mã chứng khoán hoặc tên công ty..."
                value={search}
                onChange={handleSearchChange}
                className="focus-visible:ring-brand-900 border-gray-200 bg-white pl-9"
              />
            </div>
            <div className="text-xs font-medium text-gray-500">
              Tìm thấy <span className="text-brand-900 font-bold">{total}</span>{" "}
              mã
            </div>
          </div>

          {/* Table */}
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
                      Đang tải danh sách mã chứng khoán...
                    </TableCell>
                  </TableRow>
                ) : stocks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-400"
                    >
                      Không tìm thấy mã chứng khoán nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  stocks.map((stock: any) => (
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-4">
              <div className="text-sm text-gray-500">
                Trang{" "}
                <span className="font-medium text-gray-900">{currentPage}</span>{" "}
                /{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <ButtonCustom
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </ButtonCustom>
                <ButtonCustom
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </ButtonCustom>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
