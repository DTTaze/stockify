"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Activity, useState } from "react";
import { MarketOverview } from "./components/MarketOverview";
import { PredictionPanel } from "./components/PredictionPanel";
import { StockChart } from "./components/StockChart";
import { StockSelector } from "./components/StockSelector";
import { TechnicalIndicators } from "./components/TechnicalIndicators";

export default function DashBoardPage() {
  const [selectedStock, setSelectedStock] = useState("VNM");
  const [timeRange, setTimeRange] = useState("1M");

  // Mock current stock data
  const currentPrice = 80500;
  const priceChange = 2.3;
  const volume = 1250000;

  return (
    <div className="space-y-6 p-6">
      {/* Market Overview Banner */}
      <MarketOverview />

      {/* Stock Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start space-x-6">
            <div>
              <div className="mb-2 flex items-center space-x-4">
                <StockSelector
                  value={selectedStock}
                  onChange={setSelectedStock}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-4xl text-[#1a365d]">
                  {currentPrice.toLocaleString("vi-VN")} ₫
                </div>
                <div
                  className={`flex items-center space-x-1 text-lg ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span>
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange}%
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                {/* <Activity className="h-4 w-4" /> */}
                <span>Vol: {volume.toLocaleString("vi-VN")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {["1D", "1W", "1M", "3M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-4 py-2 transition-all ${
                  timeRange === range
                    ? "bg-[#1a365d] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-[#1a365d]">Biểu đồ giá</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="h-3 w-3 rounded-full bg-[#1a365d]"></div>
            <span>Giá đóng cửa</span>
          </div>
        </div>
        <StockChart stock={selectedStock} timeRange={timeRange} />
      </div>

      {/* Prediction & Indicators */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PredictionPanel stock={selectedStock} />
        </div>
        <div>
          <TechnicalIndicators stock={selectedStock} />
        </div>
      </div>
    </div>
  );
}
