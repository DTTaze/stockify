/* eslint-disable max-lines */
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
};

export function WatchlistTable({
  watchlist,
  purchases,
  onAddTransaction,
  onDeleteTransaction,
  removingSymbol,
  onRemove,
  isLoading,
}: WatchlistTableProps) {
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
      alert("Vui lòng nhập đầy đủ thông tin giao dịch.");
      return;
    }

    const qty = parseInt(qtyStr, 10);
    const price = parseFloat(priceStr);

    if (isNaN(qty) || qty <= 0) {
      alert("Số lượng mua phải là một số lớn hơn 0.");
      return;
    }

    if (isNaN(price) || price < 0) {
      alert("Giá mua không được âm.");
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
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
      )}
    >
      <TableHeader
        className={cn("from-brand-900 to-brand-700 bg-linear-to-r text-white")}
      >
        <TableRow className="border-none hover:bg-transparent">
          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Cổ phiếu
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Giá hiện tại
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Thay đổi
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Khối lượng
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Dự đoán
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Hành động
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-white">
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
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </TableCell>
              </TableRow>
            ))
          : watchlist.map((item) => {
              const stockPurchases = purchases[item.symbol] || [];
              return (
                <React.Fragment key={item.id}>
                  <TableRow
                    className={cn(
                      "hover:bg-blue-50/50",
                      expandedSymbol === item.symbol && "bg-blue-50/30",
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
                          <div className="text-brand-900 text-sm font-semibold">
                            {item.symbol}
                          </div>

                          <div className="text-xs text-gray-500">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="text-brand-900 text-sm font-semibold">
                        {(item.price * 1000).toLocaleString("vi-VN")} ₫
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div
                        className={cn(
                          "flex items-center space-x-2",
                          item.change >= 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {item.change >= 0 ? (
                          <div className="rounded bg-green-100 p-1.5">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="rounded bg-red-100 p-1.5">
                            <TrendingDown className="h-4 w-4" />
                          </div>
                        )}

                        <span className="text-sm">
                          {item.change >= 0 ? "+" : ""}
                          {item.change.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      {item.volume.toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs",
                          item.prediction === "Tăng"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700",
                        )}
                      >
                        {item.prediction}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ButtonCustom
                          onClick={() => handleToggleExpand(item.symbol)}
                          bgColor="bg-transparent hover:bg-gray-100"
                          transition="transition-colors"
                          className={cn(
                            "flex items-center justify-center rounded-lg p-2 text-gray-600",
                          )}
                          title="Xem chi tiết"
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
                          bgColor="bg-transparent hover:bg-red-50"
                          transition="transition-colors"
                          className={cn(
                            "rounded-lg p-2 text-red-600",
                            removingSymbol === item.symbol && "opacity-50",
                          )}
                          title="Xóa khỏi Watchlist"
                        >
                          <Trash2 className="h-5 w-5" />
                        </ButtonCustom>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedSymbol === item.symbol && (
                    <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                      <TableCell
                        colSpan={6}
                        className="border-t border-b border-gray-100 px-6 py-6"
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          {/* Purchases list */}
                          <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold tracking-wider text-gray-700 uppercase">
                                Lịch sử đợt mua - {item.symbol}
                              </h4>
                              <span className="text-xs font-medium text-gray-500">
                                Tổng số đợt: {stockPurchases.length}
                              </span>
                            </div>

                            {stockPurchases.length === 0 ? (
                              <div className="rounded-xl border border-dashed bg-white py-8 text-center text-sm text-gray-400">
                                Chưa có giao dịch mua nào cho mã {item.symbol}.
                                Hãy thêm giao dịch ở bên phải!
                              </div>
                            ) : (
                              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs">
                                <table className="w-full border-collapse text-left">
                                  <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Ngày mua
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Số lượng
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Giá mua
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Tổng mua
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Hiện tại
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Lãi/Lỗ
                                      </th>
                                      <th className="w-[50px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase"></th>
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
                                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                                        >
                                          <td className="px-4 py-3 text-sm text-gray-700">
                                            {tx.purchaseDate}
                                          </td>
                                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            {tx.quantity.toLocaleString(
                                              "vi-VN",
                                            )}
                                          </td>
                                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            {tx.price.toLocaleString("vi-VN")} ₫
                                          </td>
                                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            {totalBuy.toLocaleString("vi-VN")} ₫
                                          </td>
                                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            {totalCurrent.toLocaleString(
                                              "vi-VN",
                                            )}{" "}
                                            ₫
                                          </td>
                                          <td
                                            className={`px-4 py-3 text-right text-sm font-semibold ${isProfit ? "text-green-600" : "text-red-600"}`}
                                          >
                                            {isProfit ? "+" : ""}
                                            {pl.toLocaleString("vi-VN")} ₫
                                            <span className="block text-[11px] font-normal">
                                              (
                                              {isProfit
                                                ? "Đang lãi"
                                                : "Đang lỗ"}{" "}
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
                                              className="cursor-pointer rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                              title="Xóa giao dịch"
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
                          <div className="h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <h4 className="text-sm font-bold tracking-wider text-gray-700 uppercase">
                              Thêm giao dịch mua
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-500">
                                  Ngày mua
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
                                  className="focus:border-brand-900 h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-500">
                                  Số lượng mua
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder="Ví dụ: 100"
                                  value={newTxQty[item.symbol] || ""}
                                  onChange={(e) =>
                                    setNewTxQty((prev) => ({
                                      ...prev,
                                      [item.symbol]: e.target.value,
                                    }))
                                  }
                                  className="focus:border-brand-900 h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-500">
                                  Giá mua (đ/cổ phiếu)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Ví dụ: 35000"
                                  value={newTxPrice[item.symbol] || ""}
                                  onChange={(e) =>
                                    setNewTxPrice((prev) => ({
                                      ...prev,
                                      [item.symbol]: e.target.value,
                                    }))
                                  }
                                  className="focus:border-brand-900 h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleAddSubmit(item.symbol)}
                                className="bg-brand-900 hover:bg-brand-700 mt-3 w-full cursor-pointer rounded-lg py-2 text-sm font-semibold text-white shadow-xs transition-all active:scale-98"
                              >
                                Thêm giao dịch
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
