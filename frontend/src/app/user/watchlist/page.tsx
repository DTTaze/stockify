"use client";

import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  X,
} from "lucide-react";

import { getIndexQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { QueryKeysStocks } from "@/queries/stocks/QueryKeysStocks";
import {
  useAddToWatchlist,
  useQueryWatchlist,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

const ML_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;

type MarketListItem = { symbol: string; description: string | null };

export default function WatchListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchTerm, setAddSearchTerm] = useState("");

  const { data: watchlistItems = [] } = useQueryWatchlist();
  const { data: stockList = [] } = useQuery<MarketListItem[]>({
    queryKey: ["ml-market-list"],
    queryFn: async () => {
      const res = await fetch(`${ML_URL}/market/list?type=stock`);
      const json = await res.json();
      return json.items ?? [];
    },
    enabled: showAddModal,
  });
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const quoteQueries = useQueries({
    queries: watchlistItems.map((item) => ({
      queryKey: [
        QueryKeysStocks.ROOT,
        QueryKeysStocks.QUOTE,
        item.symbol,
        MarketType.STOCK,
        TimePeriod.ONE_DAY,
      ],
      queryFn: () =>
        getIndexQuoteQueryFn({
          symbol: item.symbol,
          type: MarketType.STOCK,
          period: TimePeriod.ONE_DAY,
        }),
    })),
  });

  const watchlist = watchlistItems.map((item, i) => {
    const quote = quoteQueries[i]?.data;
    return {
      id: item.id,
      symbol: item.symbol,
      name: quote?.name ?? item.symbol,
      price: quote?.price ?? 0,
      change: quote?.change_percent ?? 0,
      volume: quote?.volume ?? 0,
      prediction: (quote?.change_percent ?? 0) >= 0 ? "Tăng" : "Giảm",
    };
  });

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCompanies = stockList.filter(
    (c: MarketListItem) =>
      c.symbol.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(addSearchTerm.toLowerCase()),
  );

  const watchlistSymbols = new Set(watchlistItems.map((i) => i.symbol));

  const handleAdd = async (symbol: string) => {
    await addMutation.mutateAsync(symbol);
    setShowAddModal(false);
    setAddSearchTerm("");
  };

  const handleRemove = (symbol: string) => {
    removeMutation.mutate(symbol);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-brand-900 mb-2 text-3xl">Watchlist của tôi</h1>
          <p className="text-gray-600">
            Theo dõi các cổ phiếu yêu thích của bạn
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm cổ phiếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-accent-500 focus:ring-accent-500 rounded-lg border-2 border-gray-200 py-2 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-900 hover:bg-brand-700 flex items-center space-x-2 rounded-lg px-4 py-2 text-white shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Tổng cổ phiếu</div>
          <div className="text-brand-900 text-3xl">{watchlist.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Tăng giá</div>
          <div className="text-3xl text-green-600">
            {watchlist.filter((w) => w.change > 0).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Giảm giá</div>
          <div className="text-3xl text-red-600">
            {watchlist.filter((w) => w.change < 0).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Tổng giá trị</div>
          <div className="text-brand-900 text-3xl">
            {(watchlist.reduce((sum, w) => sum + w.price, 0) / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="from-brand-900 to-brand-700 bg-linear-to-r text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Cổ phiếu
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Giá hiện tại
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Thay đổi
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Khối lượng
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Dự đoán
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredWatchlist.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Star className="fill-accent-500 hover:text-accent-500 h-5 w-5" />
                    <div>
                      <div className="text-brand-900 text-sm">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-brand-900 text-sm">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`flex items-center space-x-2 ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
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
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {item.volume.toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      item.prediction === "Tăng"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {item.prediction}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRemove(item.symbol)}
                    disabled={removeMutation.isPending}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredWatchlist.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Star className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-xl text-gray-600">
            {searchTerm ? "Không tìm thấy cổ phiếu" : "Watchlist trống"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Thử tìm kiếm với từ khóa khác"
              : "Nhấn + Thêm để bắt đầu theo dõi cổ phiếu"}
          </p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-brand-900 text-xl">Thêm cổ phiếu</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddSearchTerm("");
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã cổ phiếu..."
                value={addSearchTerm}
                onChange={(e) => setAddSearchTerm(e.target.value)}
                autoFocus
                className="w-full rounded-lg border-2 border-gray-200 py-2 pr-4 pl-10 outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {filteredCompanies.slice(0, 50).map((company: MarketListItem) => {
                const inWatchlist = watchlistSymbols.has(company.symbol);
                return (
                  <div
                    key={company.symbol}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
                  >
                    <div>
                      <div className="text-brand-900 text-sm font-medium">
                        {company.symbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.description ?? ""}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdd(company.symbol)}
                      disabled={inWatchlist || addMutation.isPending}
                      className="rounded-lg px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 bg-brand-900 text-white hover:bg-brand-700"
                    >
                      {inWatchlist ? "Đã thêm" : "Thêm"}
                    </button>
                  </div>
                );
              })}
              {filteredCompanies.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                  Không tìm thấy cổ phiếu
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
