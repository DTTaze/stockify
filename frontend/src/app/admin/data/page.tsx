"use client";

import { useState } from "react";
import {
  RefreshCw,
  Download,
  Upload,
  Calendar,
  Check,
  AlertCircle,
} from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  lastUpdate: string;
  records: number;
  status: "updated" | "outdated";
}

export default function DataManagement() {
  const [stockData, setStockData] = useState<StockData[]>([
    {
      symbol: "VNM",
      name: "Vinamilk",
      lastUpdate: "2026-03-20 09:00",
      records: 1250,
      status: "updated",
    },
    {
      symbol: "VCB",
      name: "Vietcombank",
      lastUpdate: "2026-03-20 09:00",
      records: 1250,
      status: "updated",
    },
    {
      symbol: "HPG",
      name: "Hòa Phát",
      lastUpdate: "2026-03-19 15:00",
      records: 1248,
      status: "outdated",
    },
    {
      symbol: "FPT",
      name: "FPT Corporation",
      lastUpdate: "2026-03-20 09:00",
      records: 1250,
      status: "updated",
    },
    {
      symbol: "VHM",
      name: "Vinhomes",
      lastUpdate: "2026-03-19 12:00",
      records: 1247,
      status: "outdated",
    },
  ]);

  const [updating, setUpdating] = useState<string | null>(null);

  const updateStockData = async (symbol: string) => {
    setUpdating(symbol);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setStockData(
      stockData.map((stock) =>
        stock.symbol === symbol
          ? {
              ...stock,
              lastUpdate: new Date().toLocaleString("vi-VN"),
              status: "updated",
              records: stock.records + 1,
            }
          : stock,
      ),
    );
    setUpdating(null);
  };

  const updateAllData = async () => {
    setUpdating("all");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const now = new Date().toLocaleString("vi-VN");
    setStockData(
      stockData.map((stock) => ({
        ...stock,
        lastUpdate: now,
        status: "updated",
        records: stock.records + 1,
      })),
    );
    setUpdating(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1a365d]">Quản lý Dữ liệu</h1>
          <p className="mt-1 text-gray-600">
            Cập nhật và quản lý dữ liệu cổ phiếu
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={updateAllData}
            disabled={updating !== null}
            className="flex items-center space-x-2 rounded-lg bg-[#1a365d] px-4 py-2 text-white shadow-md transition-all hover:bg-[#2d4a7c] disabled:opacity-50"
          >
            <RefreshCw
              className={`h-5 w-5 ${updating === "all" ? "animate-spin" : ""}`}
            />
            <span>Cập nhật tất cả</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 transition-all hover:bg-gray-50">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 transition-all hover:bg-gray-50">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Tổng cổ phiếu</div>
          <div className="text-3xl text-[#1a365d]">{stockData.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Đã cập nhật</div>
          <div className="text-3xl text-green-600">
            {stockData.filter((s) => s.status === "updated").length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Cần cập nhật</div>
          <div className="text-3xl text-orange-600">
            {stockData.filter((s) => s.status === "outdated").length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Tổng records</div>
          <div className="text-3xl text-[#1a365d]">
            {stockData.reduce((sum, s) => sum + s.records, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Cổ phiếu
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Cập nhật lần cuối
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Số lượng records
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {stockData.map((stock) => (
              <tr
                key={stock.symbol}
                className="transition-colors hover:bg-blue-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#1a365d]">{stock.symbol}</div>
                  <div className="text-xs text-gray-500">{stock.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{stock.lastUpdate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {stock.records.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {stock.status === "updated" ? (
                      <>
                        <div className="rounded bg-green-500 p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-green-600">Mới nhất</span>
                      </>
                    ) : (
                      <>
                        <div className="rounded bg-orange-500 p-1">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-orange-600">
                          Cần cập nhật
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => updateStockData(stock.symbol)}
                    disabled={updating !== null}
                    className="flex items-center space-x-2 rounded-lg bg-[#1a365d] px-3 py-2 text-white transition-all hover:bg-[#2d4a7c] disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${updating === stock.symbol ? "animate-spin" : ""}`}
                    />
                    <span>Cập nhật</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
