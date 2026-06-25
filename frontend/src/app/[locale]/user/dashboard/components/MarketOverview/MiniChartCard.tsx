import { Check, ChevronDown, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/providers/LanguageProvider";

import { MarketOverviewDataType } from "./hooks/useMarketOverview";
import { getPriceColor } from "./utils";

interface MiniChartCardProps {
  item: MarketOverviewDataType;
  allIndices: MarketOverviewDataType[];
  onSelect: (newLabel: string) => void;
}

export function MiniChartCard({
  item,
  allIndices,
  onSelect,
}: MiniChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isUp = item.change >= 0;
  const refPrice = item.ref;
  const minVal = Math.min(...item.chartData.map((d) => d.value));
  const maxVal = Math.max(...item.chartData.map((d) => d.value));

  // Pad price domain slightly to avoid touching edges
  const padding = (maxVal - minVal) * 0.05 || 1;
  const paddedMin = minVal - padding;
  const paddedMax = maxVal + padding;

  const maxVol = Math.max(...item.chartData.map((d) => d.volume || 0)) || 1;

  return (
    <Card className="border-gray-250 flex flex-col justify-between gap-0 rounded-lg border bg-white p-2 shadow-inner dark:border-slate-800 dark:bg-[#08090d]">
      {/* Inline Recharts Mini Price Line chart */}
      <div className="border-gray-150 dark:border-slate-850 relative h-[65px] w-full overflow-hidden rounded border bg-gray-50 dark:bg-[#020204]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={item.chartData}
              margin={{ top: 3, right: 3, left: 3, bottom: 3 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${item.label}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isUp ? "#22c55e" : "#ef4444"}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor={isUp ? "#22c55e" : "#ef4444"}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
                strokeOpacity={0.4}
                strokeDasharray="1 1"
              />
              <XAxis dataKey="time" hide />
              <YAxis yAxisId="price" domain={[paddedMin, paddedMax]} hide />
              <YAxis yAxisId="volume" domain={[0, maxVol * 3.5]} hide />

              {/* Volume Area */}
              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="volume"
                stroke="#0284c7"
                strokeWidth={0.8}
                fill="#0284c7"
                fillOpacity={0.08}
              />

              {/* Reference Line corresponding to Ref Price */}
              <ReferenceLine
                yAxisId="price"
                y={refPrice}
                className="stroke-gray-300 dark:stroke-slate-700"
                strokeDasharray="2 2"
                label={({ viewBox }) => {
                  const { x, y, width } = viewBox;
                  return (
                    <g>
                      <rect
                        x={x + width / 2 - 25}
                        y={y - 6}
                        width={50}
                        height={12}
                        className="fill-gray-200 dark:fill-[#0d0e12]"
                        rx={2}
                      />
                      <text
                        x={x + width / 2}
                        y={y + 3}
                        className="fill-slate-600 dark:fill-[#94a3b8]"
                        fontSize={8.5}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {refPrice.toLocaleString("vi-VN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </text>
                    </g>
                  );
                }}
              />

              {/* Price Line */}
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="value"
                stroke={isUp ? "#22c55e" : "#ef4444"}
                strokeWidth={1.5}
                fill={`url(#gradient-${item.label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse bg-slate-900/40" />
        )}
        {/* Hour timeline indicators overlay on bottom of chart */}
        <div className="absolute right-0 bottom-0 left-0 flex justify-between px-1 font-mono text-[7.5px] text-slate-500 select-none dark:text-slate-400">
          <span>09h</span>
          <span>11h</span>
          <span>13h</span>
          <span>15h</span>
        </div>
      </div>

      {/* Summary values below chart */}
      <div className="mt-2 space-y-1.5 font-sans text-[10px] font-semibold select-none">
        {/* Row 1 */}
        <div className="flex items-center justify-between">
          {/* Left: Label */}
          <button
            onClick={() => setShowModal(true)}
            className="flex cursor-pointer items-center gap-0.5 text-[11px] font-bold text-slate-800 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {item.label}{" "}
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Right: Points + Change */}
          <span
            className={`font-mono text-[10.5px] font-bold ${getPriceColor(item.change)}`}
          >
            {isUp ? "↑" : "↓"}
            {item.price.toLocaleString("vi-VN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ({item.diff > 0 ? "+" : ""}
            {item.diff.toFixed(2)} {item.change.toFixed(2)}%)
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between text-[9.5px] text-slate-500 dark:text-slate-400">
          {/* Left: Volume */}
          <span className="font-mono">
            {item.volume.toLocaleString("vi-VN")} CP
          </span>

          {/* Right: Value in Billion */}
          <span className="font-mono">
            {item.stats.valueBillion.toLocaleString("vi-VN", {
              maximumFractionDigits: 3,
            })}{" "}
            {t("billion") || "Tỷ"}
          </span>
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-between text-[9px]">
          {/* Left: Up, Flat, Down counts */}
          <div className="flex items-center gap-2 font-mono font-bold">
            <span className="text-[#22c55e]">↑ {item.stats.up}</span>
            <span className="text-[#eab308]">▬ {item.stats.flat}</span>
            <span className="text-[#ef4444]">↓ {item.stats.down}</span>
          </div>

          {/* Right: Closed status */}
          <span className="text-[8.5px] font-medium text-slate-500 dark:text-slate-400">
            {t("closed") || "Đóng cửa"}
          </span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-[360px] rounded-xl border border-gray-200 bg-white p-5 text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-[#13141b] dark:text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3">
              <span className="text-base font-bold">
                {t("selectIndex") || "Chọn chỉ số"}
              </span>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSearchQuery("");
                }}
                className="cursor-pointer rounded-full p-1 text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-2">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder") || "Tìm kiếm"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-none dark:bg-[#20222e] dark:text-white dark:placeholder-slate-400"
              />
            </div>

            {/* List */}
            <div className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent mt-4 max-h-[320px] space-y-1 overflow-y-auto pr-1">
              {allIndices
                .filter((ind) =>
                  ind.label.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((ind) => {
                  const isSelected = ind.label === item.label;
                  return (
                    <button
                      key={ind.label}
                      onClick={() => {
                        onSelect(ind.label);
                        setShowModal(false);
                        setSearchQuery("");
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700 dark:bg-[#2b2d3d] dark:text-white"
                          : "text-slate-650 hover:bg-gray-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-white"
                      }`}
                    >
                      <span>{ind.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-indigo-600 dark:text-white" />
                      )}
                    </button>
                  );
                })}
              {allIndices.filter((ind) =>
                ind.label.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">
                  {t("noIndexResults") || "Không tìm thấy kết quả"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
