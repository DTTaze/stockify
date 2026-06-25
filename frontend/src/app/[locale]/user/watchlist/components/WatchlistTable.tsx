/* eslint-disable max-lines */
"use client";

import {
  ChevronDown,
  ChevronUp,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { PredictionTrend } from "@/constants/stock";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  PurchaseTransaction,
  WatchlistQuoteItem,
} from "@/types/watchlist/watchlist.type";
import { cn } from "@/utils";

type WatchlistTableProps = {
  watchlist: WatchlistQuoteItem[];
  purchases: Record<string, PurchaseTransaction[]>;
  onAddTransaction: (
    symbol: string,
    date: string,
    quantity: number,
    price: number,
  ) => void;
  onDeleteTransaction: (symbol: string, transactionId: string) => void;
  removingSymbol: string | null;
  onRemove: (symbol: string) => void;
  isLoading?: boolean;
  thresholds: Record<string, number>;
  onSetThreshold: (symbol: string, value: number) => void;
};

export function WatchlistTable({
  watchlist,
  purchases,
  onAddTransaction,
  onDeleteTransaction,
  removingSymbol,
  onRemove,
  isLoading,
  thresholds,
  onSetThreshold,
}: WatchlistTableProps) {
  const { t } = useLanguage();
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [newTxDate, setNewTxDate] = useState<Record<string, string>>({});
  const [newTxQty, setNewTxQty] = useState<Record<string, string>>({});
  const [newTxPrice, setNewTxPrice] = useState<Record<string, string>>({});

  const handleToggleExpand = (symbol: string) => {
    if (expandedSymbol === symbol) {
      setExpandedSymbol(null);
    } else {
      setExpandedSymbol(symbol);
      if (!newTxDate[symbol]) {
        const today = new Date().toISOString().split("T")[0];
        setNewTxDate((prev) => ({ ...prev, [symbol]: today }));
      }
    }
  };

  const handleAddSubmit = (symbol: string) => {
    const date = newTxDate[symbol];
    const qtyStr = newTxQty[symbol];
    const priceStr = newTxPrice[symbol];

    if (!date || !qtyStr || !priceStr) {
      alert(t("watchlist.alertIncomplete"));
      return;
    }

    const qty = parseInt(qtyStr, 10);
    const price = parseFloat(priceStr);

    if (isNaN(qty) || qty <= 0) {
      alert(t("watchlist.alertQtyInvalid"));
      return;
    }

    if (isNaN(price) || price < 0) {
      alert(t("watchlist.alertPriceInvalid"));
      return;
    }

    onAddTransaction(symbol, date, qty, price);

    // Reset qty and price inputs
    setNewTxQty((prev) => ({ ...prev, [symbol]: "" }));
    setNewTxPrice((prev) => ({ ...prev, [symbol]: "" }));
  };

  return (
    <Table
      classNameWrapper={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      )}
    >
      <TableHeader
        className={cn("from-brand-900 to-brand-700 bg-linear-to-r text-white")}
      >
        <TableRow className="border-none hover:bg-transparent">
          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tableStock")}
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tablePrice")}
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tableChange")}
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tableVol")}
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tablePrediction")}
          </TableHead>

          <TableHead className="px-6 py-4 text-center text-xs tracking-wider text-white uppercase">
            {t("watchlist.tableAlert") || "Cảnh báo giảm"}
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            {t("watchlist.tableAction")}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-card">
        {isLoading
          ? ["sk-1", "sk-2", "sk-3"].map((rowKey) => (
              <TableRow key={rowKey}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-7 w-7 rounded" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Skeleton className="mx-auto h-8 w-14 rounded-md" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </TableCell>
              </TableRow>
            ))
          : watchlist.map((item) => {
              const stockPurchases = purchases[item.symbol] || [];
              const isPredUp = item.prediction === PredictionTrend.UP;
              return (
                <React.Fragment key={item.id}>
                  <TableRow
                    className={cn(
                      "border-border hover:bg-muted/60",
                      expandedSymbol === item.symbol && "bg-muted/50",
                    )}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Star
                          className={cn(
                            "fill-accent-500 h-5 w-5",
                            "hover:text-accent-500",
                          )}
                        />

                        <div>
                          <div className="text-foreground text-sm font-semibold">
                            {item.symbol}
                          </div>

                          <div className="text-muted-foreground text-xs">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="text-foreground text-sm font-semibold">
                        {(item.price * 1000).toLocaleString("vi-VN")} ₫
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div
                        className={cn(
                          "flex items-center space-x-2",
                          item.change >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {item.change >= 0 ? (
                          <div className="rounded bg-green-100 p-1.5 dark:bg-green-500/15">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="rounded bg-red-100 p-1.5 dark:bg-red-500/15">
                            <TrendingDown className="h-4 w-4" />
                          </div>
                        )}

                        <span className="text-sm">
                          {item.change >= 0 ? "+" : ""}
                          {item.change.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      {item.volume.toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs",
                          isPredUp
                            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
                            : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
                        )}
                      >
                        {isPredUp ? t("priceUp") : t("priceDown")}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="--"
                          value={
                            thresholds[item.symbol] !== undefined &&
                            thresholds[item.symbol] > 0
                              ? thresholds[item.symbol]
                              : ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            onSetThreshold(
                              item.symbol,
                              val === "" ? 0 : parseFloat(val),
                            );
                          }}
                          className="border-input bg-card text-foreground focus:border-accent-500 h-8 w-14 rounded-md border text-center text-xs font-semibold outline-none"
                        />
                        <span className="text-muted-foreground text-xs font-bold">
                          %
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ButtonCustom
                          onClick={() => handleToggleExpand(item.symbol)}
                          bgColor="bg-transparent hover:bg-muted"
                          transition="transition-colors"
                          className={cn(
                            "text-muted-foreground hover:text-foreground flex items-center justify-center rounded-lg p-2",
                          )}
                          title={t("watchlist.tooltipDetail")}
                        >
                          {expandedSymbol === item.symbol ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </ButtonCustom>

                        <ButtonCustom
                          onClick={() => onRemove(item.symbol)}
                          disabled={removingSymbol === item.symbol}
                          bgColor="bg-transparent hover:bg-red-50 dark:hover:bg-red-500/10"
                          transition="transition-colors"
                          className={cn(
                            "rounded-lg p-2 text-red-600 dark:text-red-400",
                            removingSymbol === item.symbol && "opacity-50",
                          )}
                          title={t("watchlist.tooltipRemove")}
                        >
                          <Trash2 className="h-5 w-5" />
                        </ButtonCustom>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedSymbol === item.symbol && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={7}
                        className="border-border border-t border-b px-6 py-6"
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          {/* Purchases list */}
                          <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-foreground text-sm font-bold tracking-wider uppercase">
                                {t("watchlist.purchaseHistory", {
                                  symbol: item.symbol,
                                })}
                              </h4>
                              <span className="text-muted-foreground text-xs font-medium">
                                {t("watchlist.totalBatches", {
                                  count: stockPurchases.length,
                                })}
                              </span>
                            </div>

                            {stockPurchases.length === 0 ? (
                              <div className="border-border bg-card text-muted-foreground rounded-xl border border-dashed py-8 text-center text-sm">
                                {t("watchlist.noTransactions", {
                                  symbol: item.symbol,
                                })}
                              </div>
                            ) : (
                              <div className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
                                <table className="w-full border-collapse text-left">
                                  <thead>
                                    <tr className="border-border bg-muted/60 border-b">
                                      <th className="text-muted-foreground px-4 py-3 text-xs font-semibold uppercase">
                                        {t("watchlist.purchaseDate")}
                                      </th>
                                      <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t("watchlist.purchaseQuantity")}
                                      </th>
                                      <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t("watchlist.purchasePrice")}
                                      </th>
                                      <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t("watchlist.totalPurchase")}
                                      </th>
                                      <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t("watchlist.currentValue")}
                                      </th>
                                      <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t("watchlist.profitLoss")}
                                      </th>
                                      <th className="text-muted-foreground w-[50px] px-4 py-3 text-center text-xs font-semibold uppercase"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {stockPurchases.map((tx) => {
                                      const totalBuy = tx.quantity * tx.price;
                                      const totalCurrent =
                                        tx.quantity * (item.price * 1000);
                                      const pl = totalCurrent - totalBuy;
                                      const plPct =
                                        tx.price > 0
                                          ? (pl / totalBuy) * 100
                                          : 0;
                                      const isProfit = pl >= 0;

                                      return (
                                        <tr
                                          key={tx.id}
                                          className="border-border hover:bg-muted/50 border-b last:border-b-0"
                                        >
                                          <td className="text-muted-foreground px-4 py-3 text-sm">
                                            {tx.purchaseDate}
                                          </td>
                                          <td className="text-foreground px-4 py-3 text-right text-sm">
                                            {tx.quantity.toLocaleString(
                                              "vi-VN",
                                            )}
                                          </td>
                                          <td className="text-foreground px-4 py-3 text-right text-sm">
                                            {tx.price.toLocaleString("vi-VN")} ₫
                                          </td>
                                          <td className="text-foreground px-4 py-3 text-right text-sm">
                                            {totalBuy.toLocaleString("vi-VN")} ₫
                                          </td>
                                          <td className="text-foreground px-4 py-3 text-right text-sm">
                                            {totalCurrent.toLocaleString(
                                              "vi-VN",
                                            )}{" "}
                                            ₫
                                          </td>
                                          <td
                                            className={`px-4 py-3 text-right text-sm font-semibold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                          >
                                            {isProfit ? "+" : ""}
                                            {pl.toLocaleString("vi-VN")} ₫
                                            <span className="block text-[11px] font-normal">
                                              (
                                              {isProfit
                                                ? t("watchlist.profit")
                                                : t("watchlist.loss")}{" "}
                                              {isProfit ? "+" : ""}
                                              {plPct.toFixed(2)}%)
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <button
                                              onClick={() =>
                                                onDeleteTransaction(
                                                  item.symbol,
                                                  tx.id,
                                                )
                                              }
                                              className="cursor-pointer rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                              title={t(
                                                "watchlist.tooltipDeleteTx",
                                              )}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* Add Purchase Form */}
                          <div className="border-border bg-card h-fit space-y-3 rounded-xl border p-4 shadow-sm">
                            <h4 className="text-foreground text-sm font-bold tracking-wider uppercase">
                              {t("watchlist.addPurchaseTx")}
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                                  {t("watchlist.purchaseDate")}
                                </label>
                                <input
                                  type="date"
                                  value={newTxDate[item.symbol] || ""}
                                  onChange={(e) =>
                                    setNewTxDate((prev) => ({
                                      ...prev,
                                      [item.symbol]: e.target.value,
                                    }))
                                  }
                                  className="focus:border-brand-700 border-input bg-background text-foreground dark:focus:border-brand-400 h-9 w-full rounded-lg border px-3 text-sm focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                                  {t("watchlist.purchaseQuantity")}
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder={t("watchlist.placeholderQty")}
                                  value={newTxQty[item.symbol] || ""}
                                  onChange={(e) =>
                                    setNewTxQty((prev) => ({
                                      ...prev,
                                      [item.symbol]: e.target.value,
                                    }))
                                  }
                                  className="focus:border-brand-700 border-input bg-background text-foreground dark:focus:border-brand-400 h-9 w-full rounded-lg border px-3 text-sm focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                                  {t("watchlist.purchasePrice")}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={t("watchlist.placeholderPrice")}
                                  value={newTxPrice[item.symbol] || ""}
                                  onChange={(e) =>
                                    setNewTxPrice((prev) => ({
                                      ...prev,
                                      [item.symbol]: e.target.value,
                                    }))
                                  }
                                  className="focus:border-brand-700 border-input bg-background text-foreground dark:focus:border-brand-400 h-9 w-full rounded-lg border px-3 text-sm focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleAddSubmit(item.symbol)}
                                className="bg-brand-900 hover:bg-brand-700 mt-3 w-full cursor-pointer rounded-lg py-2 text-sm font-semibold text-white shadow-xs transition-all active:scale-98"
                              >
                                {t("watchlist.addTxButton")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
      </TableBody>
    </Table>
  );
}
