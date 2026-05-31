import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Search,
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
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

type Props = {
  symbols: string[];
  type: "futures" | "bonds" | "indices";
  isLoading: boolean;
};

const ITEMS_PER_PAGE = 15;

const ASSET_NAMES: Record<
  string,
  { title: string; category: string; icon: React.ElementType }
> = {
  futures: {
    title: "Hợp đồng tương lai",
    category: "Phái sinh",
    icon: Activity,
  },
  bonds: {
    title: "Trái phiếu chính phủ",
    category: "Công nợ / Trái phiếu",
    icon: FileText,
  },
  indices: { title: "Bộ chỉ số", category: "Chỉ số thị trường", icon: Layers },
};

const INDEX_NAMES: Record<string, string> = {
  VNINDEX: "Chỉ số VN-INDEX - Sở GD HCM (HOSE)",
  VN30: "Chỉ số VN30 - 30 cổ phiếu hàng đầu",
  HNXINDEX: "Chỉ số HNX-INDEX - Sở GD Hà Nội (HNX)",
  HNX30: "Chỉ số HNX30 - 30 cổ phiếu hàng đầu HNX",
  UPCOMINDEX: "Chỉ số UPCoM-INDEX - Sàn Giao dịch đại chúng chưa niêm yết",
};

export function UserSimpleSymbolsTable({ symbols, type, isLoading }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    title,
    category,
    icon: Icon,
  } = ASSET_NAMES[type] || {
    title: "Danh sách mã",
    category: "Thị trường",
    icon: Layers,
  };

  // Filter symbols based on search
  const filteredSymbols = useMemo(() => {
    return symbols.filter((sym) =>
      sym.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [symbols, searchQuery]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSymbols.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSymbols = filteredSymbols.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getSymbolDescription = (symbol: string) => {
    if (type === "indices") {
      return INDEX_NAMES[symbol.toUpperCase()] || "Chỉ số chứng khoán Việt Nam";
    }
    if (type === "futures") {
      return symbol.toUpperCase().startsWith("VN30F")
        ? `Hợp đồng tương lai chỉ số VN30 đáo hạn`
        : `Hợp đồng tương lai chứng khoán phái sinh`;
    }
    return "Trái phiếu chính phủ Việt Nam phát hành";
  };

  return (
    <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardContent className="p-0">
        {/* Search bar */}
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={`Tìm kiếm mã ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-visible:ring-brand-900 h-9 border-gray-200 bg-white pl-9"
            />
          </div>
          <div className="text-xs font-medium text-gray-500">
            Tìm thấy{" "}
            <span className="text-brand-900 font-bold">
              {filteredSymbols.length}
            </span>{" "}
            mã
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-900 hover:bg-brand-900 border-b-0 text-white">
                <TableHead className="w-1/4 p-4 text-sm font-semibold tracking-wider text-white uppercase">
                  Mã chứng khoán
                </TableHead>
                <TableHead className="w-1/2 text-sm font-semibold tracking-wider text-white uppercase">
                  Mô tả / Tên gọi
                </TableHead>
                <TableHead className="w-1/4 text-sm font-semibold tracking-wider text-white uppercase">
                  Phân loại tài sản
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((rowKey) => (
                  <TableRow key={rowKey}>
                    <TableCell className="p-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedSymbols.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-gray-400"
                  >
                    Không tìm thấy kết quả nào.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSymbols.map((symbol) => (
                  <TableRow key={symbol} className="hover:bg-gray-50/50">
                    <TableCell className="text-brand-900 p-4 font-bold">
                      {symbol}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {getSymbolDescription(symbol)}
                    </TableCell>
                    <TableCell className="flex items-center gap-1.5 py-4 text-sm text-gray-500">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span>{category}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination control */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-4">
            <div className="text-sm text-gray-500">
              Trang{" "}
              <span className="font-medium text-gray-900">{currentPage}</span> /{" "}
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
  );
}
