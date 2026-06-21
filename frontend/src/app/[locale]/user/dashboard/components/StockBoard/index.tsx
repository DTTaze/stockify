import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { BoardHeader } from "./BoardHeader";
import { BoardPagination } from "./BoardPagination";
import { BoardRow } from "./BoardRow";
import { BoardSkeleton } from "./BoardSkeleton";
import { ITEMS_PER_PAGE, useStockBoard } from "./useStockBoard";

interface StockBoardProps {
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
}

export function StockBoard({ selectedStock, onSelectStock }: StockBoardProps) {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    watchlistSymbols,
    trainedSymbols,
    marketTotal,
    marketTotalPages,
    isMarketTab,
    boardRows,
    isLoading,
    handleTabChange,
    handleWatchlistToggle,
    addToWatchlist,
    removeFromWatchlist,
    t,
  } = useStockBoard();

  const isMutatingWatchlist =
    addToWatchlist.isPending || removeFromWatchlist.isPending;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
      {/* Board Navigation */}
      <BoardHeader
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTabChange={handleTabChange}
      />

      {/* Grid Scroll Area */}
      <Table
        classNameWrapper="no-scrollbar min-h-[300px] flex-1 overflow-auto"
        className="w-full border-collapse text-left select-none"
      >
        <TableHeader>
          {/* Row 1 Header */}
          <TableRow className="dark:text-slate-405 border-b border-gray-200 bg-gray-50/70 text-center text-[9px] font-bold tracking-wider text-gray-500 uppercase dark:border-slate-800 dark:bg-slate-900/60">
            <TableHead
              rowSpan={2}
              className="w-8 border-r border-gray-200 p-2 dark:border-slate-800"
            >
              ★
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[70px] border-r border-gray-200 p-2 text-left dark:border-slate-800"
            >
              {t("stocks")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[45px] border-r border-gray-200 p-2 text-fuchsia-600 dark:border-slate-800 dark:text-fuchsia-400"
            >
              {t("ceil")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[45px] border-r border-gray-200 p-2 text-cyan-600 dark:border-slate-800 dark:text-cyan-400"
            >
              {t("floor")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-amber-505 min-w-[45px] border-r border-gray-200 p-2 dark:border-slate-800 dark:text-yellow-400"
            >
              {t("ref")}
            </TableHead>
            <TableHead
              colSpan={6}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("buyer")}
            </TableHead>
            <TableHead
              colSpan={3}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("match")}
            </TableHead>
            <TableHead
              colSpan={6}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("seller")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[75px] border-r border-gray-200 p-2 text-right dark:border-slate-800"
            >
              {t("totalVol")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[50px] border-r border-gray-200 p-2 text-right text-green-600 dark:border-slate-800 dark:text-green-400"
            >
              {t("high")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="dark:text-rose-455 min-w-[50px] p-2 text-right text-rose-600"
            >
              {t("low")}
            </TableHead>
          </TableRow>
          {/* Row 2 Header (Bid / Match / Ask subcolumns) */}
          <TableRow className="text-gray-550 dark:text-slate-505 border-b border-gray-200 bg-gray-50/40 text-right text-[8px] font-extrabold uppercase dark:border-slate-800 dark:bg-slate-900/40">
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price3")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty3")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price2")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty2")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price1")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200 p-1 dark:border-slate-800">
              {t("qty1")}
            </TableHead>
            <TableHead className="text-gray-650 min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40 dark:text-slate-300">
              {t("price")}
            </TableHead>
            <TableHead className="text-gray-655 min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40 dark:text-slate-300">
              {t("quantity")}
            </TableHead>
            <TableHead className="text-gray-655 border-r border-gray-200 p-1 dark:border-slate-800 dark:text-slate-300">
              {t("changePercent")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price1")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty1")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price2")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty2")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price3")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200 p-1 dark:border-slate-800">
              {t("qty3")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-gray-150 divide-y font-mono text-[10px] dark:divide-slate-900">
          {isLoading ? (
            <BoardSkeleton rowsCount={ITEMS_PER_PAGE} />
          ) : boardRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={24}
                className="dark:text-slate-505 py-12 text-center text-xs font-semibold text-gray-400 uppercase"
              >
                {t("noStocksFound")}
              </TableCell>
            </TableRow>
          ) : (
            boardRows.map((row) => (
              <BoardRow
                key={row.symbol}
                row={row}
                isSelected={selectedStock === row.symbol}
                onSelectStock={onSelectStock}
                watchlistSymbols={watchlistSymbols}
                trainedSymbols={trainedSymbols}
                handleWatchlistToggle={handleWatchlistToggle}
                isMutatingWatchlist={isMutatingWatchlist}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {isMarketTab && marketTotalPages > 1 && (
        <BoardPagination
          currentPage={currentPage}
          marketTotalPages={marketTotalPages}
          marketTotal={marketTotal}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
