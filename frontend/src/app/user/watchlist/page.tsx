"use client";

import { useState } from "react";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
} from "lucide-react";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  prediction: string;
}

export default function WatchListPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      id: "1",
      symbol: "VNM",
      name: "Vinamilk",
      price: 80500,
      change: 2.3,
      volume: 1250000,
      prediction: "Tăng",
    },
    {
      id: "2",
      symbol: "VCB",
      name: "Vietcombank",
      price: 95200,
      change: -1.2,
      volume: 2100000,
      prediction: "Giảm",
    },
    {
      id: "3",
      symbol: "HPG",
      name: "Hòa Phát",
      price: 28700,
      change: 3.5,
      volume: 3500000,
      prediction: "Tăng",
    },
    {
      id: "4",
      symbol: "FPT",
      name: "FPT Corporation",
      price: 125000,
      change: 1.8,
      volume: 980000,
      prediction: "Tăng",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  };

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl text-[#1a365d]">Watchlist của tôi</h1>
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
              className="rounded-lg border-2 border-gray-200 py-2 pr-4 pl-10 transition-all outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>
          <button className="flex items-center space-x-2 rounded-lg bg-[#1a365d] px-4 py-2 text-white shadow-md transition-all hover:bg-[#2d4a7c] hover:shadow-lg">
            <Plus className="h-5 w-5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Tổng cổ phiếu</div>
          <div className="text-3xl text-[#1a365d]">{watchlist.length}</div>
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
          <div className="text-3xl text-[#1a365d]">
            {(watchlist.reduce((sum, w) => sum + w.price, 0) / 1000).toFixed(0)}
            K
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white">
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
                    <Star className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                    <div>
                      <div className="text-sm text-[#1a365d]">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#1a365d]">
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
                      {item.change}%
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
                    onClick={() => removeFromWatchlist(item.id)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
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
            Không tìm thấy cổ phiếu
          </h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
}
