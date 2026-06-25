"use client";

import { Search, Star } from "lucide-react";
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
import { useLanguage } from "@/providers/LanguageProvider";
import {
  useAddToWatchlist,
  useQueryWatchlist,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { ClassificationStock, IcbIndustry } from "@/types/stock/stock.type";
import { cn } from "@/utils";

import { StocksPagination } from "./StocksPagination";

type Props = {
  icbIndustries: IcbIndustry[];
  activeIcbCode: string;
  icbSearch: string;
  icbPage: number;
  icbPageSize: number;
  icbStocks: ClassificationStock[];
  icbTotal: number;
  icbTotalPages: number;
  isIcbLoading: boolean;
  isIcbIndustriesLoading: boolean;
  onIcbTabChange: (code: string) => void;
  onIcbSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIcbPageChange: React.Dispatch<React.SetStateAction<number>>;
  onIcbPageSizeChange: (pageSize: number) => void;
};

export function UserIcbClassificationTable({
  icbIndustries,
  activeIcbCode,
  icbSearch,
  icbPage,
  icbPageSize,
  icbStocks,
  icbTotal,
  icbTotalPages,
  isIcbLoading,
  isIcbIndustriesLoading,
  onIcbTabChange,
  onIcbSearch,
  onIcbPageChange,
  onIcbPageSizeChange,
}: Props) {
  const { t } = useLanguage();
  const { data: watchlistItems = [] } = useQueryWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const watchlistSymbols = React.useMemo(
    () => new Set(watchlistItems.map((item) => item.symbol)),
    [watchlistItems],
  );

  return (
    <Card className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <CardContent className="p-0">
        {/* Industry Filters */}
        <div className="border-border bg-muted/30 border-b p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
            {/* Custom Searchable Hierarchical Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-800 dark:text-brand-300 text-[10px] font-bold tracking-wider uppercase">
                {t("stocks.chooseIcb")}
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
                <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  {t("stocks.searchIcbPlaceholder")}
                </label>
                <div className="text-muted-foreground text-xs font-medium">
                  {t("stocks.foundCount", { count: icbTotal })}
                </div>
              </div>
              <div className="relative w-full">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder={t("stocks.searchIcbPlaceholder")}
                  value={icbSearch}
                  onChange={onIcbSearch}
                  className="border-input bg-background focus-visible:ring-brand-700 dark:focus-visible:ring-brand-400 h-9 pl-9"
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
                  {t("stocks.tableSymbol")}
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableCompany")}
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableExchange")}
                </TableHead>
                <TableHead className="text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableClassification")}
                </TableHead>
                <TableHead className="w-[100px] text-center text-sm font-semibold tracking-wider text-white uppercase">
                  {t("stocks.tableWatch")}
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
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-5 w-5 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : icbStocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-32 text-center"
                  >
                    {t("stocks.noStocksIcb")}
                  </TableCell>
                </TableRow>
              ) : (
                icbStocks.map((stock: ClassificationStock) => (
                  <TableRow
                    key={stock.symbol}
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="text-brand-800 dark:text-brand-300 p-4 font-bold">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {stock.name || stock.organName || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                      >
                        {stock.exchange}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm capitalize">
                        {stock.type || "stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => {
                          if (watchlistSymbols.has(stock.symbol)) {
                            removeFromWatchlist.mutate(stock.symbol);
                          } else {
                            addToWatchlist.mutate(stock.symbol);
                          }
                        }}
                        disabled={
                          addToWatchlist.isPending ||
                          removeFromWatchlist.isPending
                        }
                        className="hover:bg-muted cursor-pointer rounded-lg p-1.5 transition-colors disabled:opacity-50"
                        title={
                          watchlistSymbols.has(stock.symbol)
                            ? t("stocks.tooltipUnfollow")
                            : t("stocks.tooltipFollow")
                        }
                      >
                        <Star
                          className={cn(
                            "h-5 w-5 transition-transform active:scale-95",
                            watchlistSymbols.has(stock.symbol)
                              ? "fill-accent-500 text-accent-500"
                              : "text-muted-foreground hover:text-accent-500",
                          )}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <StocksPagination
          currentPage={icbPage}
          totalPages={icbTotalPages}
          pageSize={icbPageSize}
          onPageChange={onIcbPageChange}
          onPageSizeChange={onIcbPageSizeChange}
        />
      </CardContent>
    </Card>
  );
}
