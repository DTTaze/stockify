import { ChevronDown } from "lucide-react";
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

import { MarketOverviewDataType } from "./useMarketOverview";
import { getPriceColor } from "./utils";

interface MiniChartCardProps {
  item: MarketOverviewDataType;
}

export function MiniChartCard({ item }: MiniChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);
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

  let offset = 0.5;
  if (paddedMax !== paddedMin) {
    offset = (paddedMax - refPrice) / (paddedMax - paddedMin);
  }
  offset = Math.max(0, Math.min(1, offset));

  const maxVol = Math.max(...item.chartData.map((d) => d.volume || 0)) || 1;

  return (
    <Card className="border-gray-150 bg-gray-55/50 flex flex-col justify-between gap-0 rounded-lg border p-2.5 py-2.5 shadow-inner dark:border-slate-900 dark:bg-slate-900/10">
      {/* Inline Recharts Mini Price Line chart */}
      <div className="relative h-[65px] w-full overflow-hidden rounded border border-gray-200 bg-white dark:border-[#1e293b] dark:bg-[#0d0e12]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={item.chartData}
              margin={{ top: 3, right: 3, left: 3, bottom: 3 }}
            >
              <defs>
                <linearGradient
                  id={`stroke-${item.label}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#26a69a" />
                  <stop offset={`${offset * 100}%`} stopColor="#26a69a" />
                  <stop offset={`${offset * 100}%`} stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
                strokeOpacity={0.5}
                strokeDasharray="1 1"
              />
              <XAxis dataKey="time" hide />
              <YAxis yAxisId="price" domain={[paddedMin, paddedMax]} hide />
              <YAxis yAxisId="volume" domain={[0, maxVol * 3.5]} hide />

              {/* Volume Area (rendered behind price line) */}
              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="volume"
                stroke="#38bdf8"
                strokeWidth={1}
                fill="#38bdf8"
                fillOpacity={0.12}
              />

              {/* Reference Line corresponding to Ref Price */}
              <ReferenceLine
                yAxisId="price"
                y={refPrice}
                stroke="var(--border)"
                strokeDasharray="3 3"
                label={({ viewBox }) => {
                  const { x, y, width } = viewBox;
                  return (
                    <g>
                      <rect
                        x={x + width / 2 - 25}
                        y={y - 6}
                        width={50}
                        height={12}
                        fill="var(--background)"
                        rx={2}
                      />
                      <text
                        x={x + width / 2}
                        y={y + 3}
                        fill="#94a3b8"
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
                stroke={`url(#stroke-${item.label})`}
                strokeWidth={1.6}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse bg-slate-900/40" />
        )}
        {/* Hour timeline indicators overlay on bottom of chart */}
        <div className="text-gray-550 dark:text-slate-650 absolute right-0 bottom-0 left-0 flex justify-between px-1 font-mono text-[7px] select-none">
          <span>09h</span>
          <span>11h</span>
          <span>13h</span>
          <span>15h</span>
        </div>
      </div>

      {/* Summary values below chart */}
      <div className="mt-2.5 space-y-1 font-mono select-none">
        <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-slate-200">
          <span className="dark:text-slate-355 flex items-center gap-0.5 font-sans text-[11px] text-gray-700">
            {item.label}{" "}
            <ChevronDown className="h-3 w-3 text-gray-400 dark:text-slate-500" />
          </span>
          <span className={getPriceColor(item.change)}>
            {item.price.toLocaleString("vi-VN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="dark:text-slate-505 font-sans text-gray-500">
            {item.volume.toLocaleString("vi-VN")} CP
          </span>
          <span className={`flex items-center ${getPriceColor(item.change)}`}>
            {isUp ? "↑" : "↓"} {Math.abs(item.diff).toFixed(2)} (
            {isUp ? "+" : ""}
            {item.change.toFixed(2)}%)
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 text-[10px] font-bold dark:border-slate-900/60">
          <span className="text-gray-650 font-sans font-normal dark:text-slate-400">
            GTGD:{" "}
            <strong className="text-gray-800 dark:text-slate-300">
              {item.stats.valueBillion.toLocaleString("vi-VN", {
                maximumFractionDigits: 1,
              })}{" "}
              {t("billion")}
            </strong>
          </span>
          <span className="dark:text-slate-505 font-sans text-[9px] font-semibold text-gray-500">
            {t("closed")}
          </span>
        </div>

        {/* Stock Split Ribbon */}
        <div className="flex items-center justify-between pt-1.5 font-sans text-[9px] font-bold">
          <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
            ↑ {item.stats.up}{" "}
            {item.stats.ceil > 0 && (
              <span className="text-fuchsia-600 dark:text-fuchsia-400">
                ({item.stats.ceil})
              </span>
            )}
          </span>
          <span className="text-amber-600 dark:text-yellow-400">
            ▬ {item.stats.flat}
          </span>
          <span className="flex items-center gap-0.5 text-red-600 dark:text-red-500">
            ↓ {item.stats.down}{" "}
            {item.stats.floor > 0 && (
              <span className="text-cyan-600 dark:text-cyan-400">
                ({item.stats.floor})
              </span>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}
