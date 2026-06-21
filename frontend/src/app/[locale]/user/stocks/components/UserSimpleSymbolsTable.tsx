"use client";

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
import { useLanguage } from "@/providers/LanguageProvider";

type Props = {
  symbols: string[];
  type: "futures" | "bonds" | "indices";
  isLoading: boolean;
};

const ITEMS_PER_PAGE = 15;

export function UserSimpleSymbolsTable({ symbols, type, isLoading }: Props) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const assetInfo = useMemo(() => {
    const mapping: Record<
      string,
      { title: string; category: string; icon: React.ElementType }
    > = {
      futures: {
        title: t("stocks.futuresTab"),
        category: t("stocks.derivative"),
        icon: Activity,
      },
      bonds: {
        title: t("stocks.bondsTab"),
        category: t("stocks.bondsDesc"),
        icon: FileText,
      },
      indices: {
        title: t("stocks.indicesTab"),
        category: t("stocks.indicesDesc"),
        icon: Layers,
      },
    };
    return (
      mapping[type] || {
        title: t("stocks.assetTitle"),
        category: t("stocks.assetCategory"),
        icon: Layers,
      }
    );
  }, [type, t]);

  const { title, category, icon: Icon } = assetInfo;

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
      const uSym = symbol.toUpperCase();
      if (uSym === "VNINDEX") {
        return t("stocks.vnIndexDesc");
      }
      if (uSym === "VN30") {
        return t("stocks.vn30Desc");
      }
      if (uSym === "HNXINDEX") {
        return t("stocks.hnxIndexDesc");
      }
      if (uSym === "HNX30") {
        return t("stocks.hnx30Desc");
      }
      if (uSym === "UPCOMINDEX") {
        return t("stocks.upcomIndexDesc");
      }
      return t("stocks.vietnamIndices");
    }
    if (type === "futures") {
      return symbol.toUpperCase().startsWith("VN30F")
        ? t("stocks.futuresVn30")
        : t("stocks.futuresDerivatives");
    }
    return t("stocks.govBonds");
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
              placeholder={t("stocks.searchSimplePlaceholder", { title })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-visible:ring-brand-900 h-9 border-gray-200 bg-white pl-9"
            />
          </div>
          <div className="text-xs font-medium text-gray-500">
            {t("stocks.foundCount", { count: filteredSymbols.length })}
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-900 hover:bg-brand-900 border-b-0 text-white">
                <TableHead className="w-1/4 p-4 text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableSymbol")}
                </TableHead>
                <TableHead className="w-1/2 text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableCompany")}
                </TableHead>
                <TableHead className="w-1/4 text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableClassification")}
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
                    {t("stocks.noResults")}
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
              {t("stocks.pageIndicator", {
                current: currentPage,
                total: totalPages,
              })}
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
