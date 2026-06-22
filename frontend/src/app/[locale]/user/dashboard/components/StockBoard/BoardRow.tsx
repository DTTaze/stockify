import { Sparkles, Star } from "lucide-react";
import React from "react";

import { TableCell, TableRow } from "@/components/ui/Table";
import {
  calculateHighLow,
  calculatePriceLimits,
  simulateOrderBook,
} from "@/utils/stockQuoteSim";

import {
  BoardRowDataType,
  TrainedSymbolsListType,
  WatchlistSymbolsSetType,
} from "./hooks/useStockBoard";

interface BoardRowProps {
  row: BoardRowDataType;
  isSelected: boolean;
  onSelectStock: (symbol: string) => void;
  watchlistSymbols: WatchlistSymbolsSetType;
  trainedSymbols: TrainedSymbolsListType;
  handleWatchlistToggle: (e: React.MouseEvent, symbol: string) => void;
  isMutatingWatchlist: boolean;
}

export function BoardRow({
  row,
  isSelected,
  onSelectStock,
  watchlistSymbols,
  trainedSymbols,
  handleWatchlistToggle,
  isMutatingWatchlist,
}: BoardRowProps) {
  const isTrained = trainedSymbols.includes(row.symbol);
  const price = row.price;
  const change = row.change;

  const { tc, tran, san } = calculatePriceLimits(
    row.price,
    row.change,
    row.exchange,
  );

  const getPriceColor = (val: number) => {
    if (val >= tran) {
      return "text-fuchsia-600 dark:text-fuchsia-400 font-semibold";
    }
    if (val <= san) {
      return "text-cyan-600 dark:text-cyan-400 font-semibold";
    }
    if (Math.abs(val - tc) < 0.015) {
      return "text-amber-505 dark:text-yellow-400";
    }
    return val > tc
      ? "text-green-600 dark:text-green-400"
      : "text-red-650 dark:text-red-400";
  };

  const matchColor =
    change === 0
      ? "text-amber-505 dark:text-yellow-400"
      : change > 0
        ? "text-green-600 dark:text-green-400 font-semibold"
        : "text-red-650 dark:text-red-400 font-semibold";

  const { bids, asks } = simulateOrderBook(row.symbol, row.price, tran, san);
  const [b1, b2, b3] = bids;
  const [a1, a2, a3] = asks;

  const { highPrice, lowPrice } = calculateHighLow(row.price);

  const formatBoardVolume = (val: number) => {
    if (val <= 0) {
      return "--";
    }
    return Math.round(val / 10).toLocaleString("vi-VN");
  };

  return (
    <TableRow
      onClick={() => onSelectStock(row.symbol)}
      className={`hover:bg-gray-55/50 border-gray-150 cursor-pointer border-b transition-colors dark:border-slate-900/60 dark:hover:bg-slate-900/40 ${
        isSelected
          ? "border-l-2 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20"
          : ""
      }`}
    >
      {/* Watchlist Toggle */}
      <TableCell className="border-gray-250 border-r p-2 text-center dark:border-slate-900">
        <button
          onClick={(e) => handleWatchlistToggle(e, row.symbol)}
          disabled={isMutatingWatchlist}
          className="text-gray-355 cursor-pointer transition-colors hover:text-yellow-500 dark:text-slate-700 dark:hover:text-yellow-400"
        >
          <Star
            className={`h-3.5 w-3.5 transition-transform active:scale-90 ${
              watchlistSymbols.has(row.symbol)
                ? "fill-yellow-500 text-yellow-500"
                : ""
            }`}
          />
        </button>
      </TableCell>

      {/* Ticker Code */}
      <TableCell className="border-gray-250 border-r p-2 text-left font-semibold text-gray-800 dark:border-slate-900 dark:text-slate-200">
        <div className="flex items-center gap-1">
          <span>{row.symbol}</span>
          {isTrained && (
            <span
              title="Có phân tích AI LSTM"
              className="rounded-full bg-purple-500/10 p-0.5"
            >
              <Sparkles className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400" />
            </span>
          )}
        </div>
      </TableCell>

      {/* Trần / Sàn / TC */}
      <TableCell
        className={`border-gray-250 border-r bg-gray-50/10 p-2 text-right font-bold dark:border-slate-900 dark:bg-slate-950/10 ${getPriceColor(
          tran,
        )}`}
      >
        {tran.toFixed(2)}
      </TableCell>
      <TableCell
        className={`border-gray-250 border-r bg-gray-50/10 p-2 text-right font-bold dark:border-slate-900 dark:bg-slate-950/10 ${getPriceColor(
          san,
        )}`}
      >
        {san.toFixed(2)}
      </TableCell>
      <TableCell
        className={`border-gray-250 border-r bg-gray-50/10 p-2 text-right font-bold dark:border-slate-900 dark:bg-slate-950/10 ${getPriceColor(
          tc,
        )}`}
      >
        {tc.toFixed(2)}
      </TableCell>

      {/* Bên Mua (Bid 3, Bid 2, Bid 1) */}
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(b3.price)}`}
      >
        {price > 0 ? b3.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="text-gray-550 border-r border-gray-200/40 p-1 text-right font-normal dark:border-slate-800/40 dark:text-slate-400">
        {price > 0 ? b3.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(b2.price)}`}
      >
        {price > 0 ? b2.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="text-gray-550 border-r border-gray-200/40 p-1 text-right font-normal dark:border-slate-800/40 dark:text-slate-400">
        {price > 0 ? b2.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(b1.price)}`}
      >
        {price > 0 ? b1.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="border-gray-250 text-gray-550 border-r p-1 text-right font-normal dark:border-slate-900 dark:text-slate-400">
        {price > 0 ? b1.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>

      {/* Khớp Lệnh */}
      <TableCell
        className={`border-r border-gray-200/40 bg-gray-50/20 p-1 text-right dark:border-slate-800/40 dark:bg-slate-900/20 ${matchColor} text-[11px]`}
      >
        {price > 0 ? price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="border-r border-gray-200/40 bg-gray-50/20 p-1 text-right font-normal text-gray-700 dark:border-slate-800/40 dark:bg-slate-900/20 dark:text-slate-300">
        {price > 0
          ? Math.round(row.volume / 200).toLocaleString("vi-VN")
          : "--"}
      </TableCell>
      <TableCell
        className={`border-gray-250 border-r bg-gray-50/20 p-1 text-right dark:border-slate-900 dark:bg-slate-900/20 ${matchColor}`}
      >
        {price > 0 ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "--"}
      </TableCell>

      {/* Bên Bán (Ask 1, Ask 2, Ask 3) */}
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(a1.price)}`}
      >
        {price > 0 ? a1.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="text-gray-550 border-r border-gray-200/40 p-1 text-right font-normal dark:border-slate-800/40 dark:text-slate-400">
        {price > 0 ? a1.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(a2.price)}`}
      >
        {price > 0 ? a2.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="text-gray-550 border-r border-gray-200/40 p-1 text-right font-normal dark:border-slate-800/40 dark:text-slate-400">
        {price > 0 ? a2.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>
      <TableCell
        className={`border-r border-gray-200/40 p-1 text-right dark:border-slate-800/40 ${getPriceColor(a3.price)}`}
      >
        {price > 0 ? a3.price.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="border-gray-250 text-gray-555 border-r p-1 text-right font-normal dark:border-slate-900 dark:text-slate-400">
        {price > 0 ? a3.volume.toLocaleString("vi-VN") : "--"}
      </TableCell>

      {/* Tổng KL */}
      <TableCell className="border-gray-250 border-r bg-gray-50/10 p-2 text-right text-gray-700 dark:border-slate-900 dark:bg-slate-950/10 dark:text-slate-300">
        {price > 0 ? formatBoardVolume(row.volume) : "--"}
      </TableCell>

      {/* Cao / Thấp */}
      <TableCell className="border-gray-250 border-r bg-gray-50/10 p-2 text-right text-green-600 dark:border-slate-900 dark:bg-slate-950/10 dark:text-green-400">
        {price > 0 ? highPrice.toFixed(2) : "--"}
      </TableCell>
      <TableCell className="bg-gray-55/10 p-2 text-right text-rose-600 dark:bg-slate-950/10 dark:text-rose-400">
        {price > 0 ? lowPrice.toFixed(2) : "--"}
      </TableCell>
    </TableRow>
  );
}
