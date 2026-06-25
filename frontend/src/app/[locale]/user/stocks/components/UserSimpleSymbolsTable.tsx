"use client";

import { Layers, Search } from "lucide-react";
import React, { useMemo, useState } from "react";

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

import { StocksPagination } from "./StocksPagination";

type Props = {
  symbols: string[];
  isLoading: boolean;
};

const DEFAULT_PAGE_SIZE = 15;

export function UserSimpleSymbolsTable({ symbols, isLoading }: Props) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const assetInfo = useMemo(
    () => ({
      title: t("stocks.indicesTab"),
      category: t("stocks.indicesDesc"),
      icon: Layers,
    }),
    [t],
  );

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

  const totalPages = Math.ceil(filteredSymbols.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSymbols = filteredSymbols.slice(
    startIndex,
    startIndex + pageSize,
  );

  const getSymbolDescription = (symbol: string) => {
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
  };

  return (
    <Card className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <CardContent className="p-0">
        {/* Search bar */}
        <div className="border-border bg-muted/30 flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={t("stocks.searchSimplePlaceholder", { title })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-input bg-background focus-visible:ring-brand-700 dark:focus-visible:ring-brand-400 h-9 pl-9"
            />
          </div>
          <div className="text-muted-foreground text-xs font-medium">
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
                    className="text-muted-foreground h-32 text-center"
                  >
                    {t("stocks.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSymbols.map((symbol) => (
                  <TableRow
                    key={symbol}
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="text-brand-800 dark:text-brand-300 p-4 font-bold">
                      {symbol}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {getSymbolDescription(symbol)}
                    </TableCell>
                    <TableCell className="text-muted-foreground flex items-center gap-1.5 py-4 text-sm">
                      <Icon className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                      <span>{category}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <StocksPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </CardContent>
    </Card>
  );
}
