"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLanguage } from "@/providers/LanguageProvider";
import { OrderBookSimulation, PriceLimits } from "@/utils/stockQuoteSim";

import { getPriceColor } from "../utils";

interface OrderBookProps {
  orderBook: OrderBookSimulation;
  limits: PriceLimits;
}

export function OrderBook({ orderBook, limits }: OrderBookProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { bids, asks, totalBuyVol, totalSellVol } = orderBook;
  const { tc, tran, san } = limits;
  const [b1, b2, b3] = bids;
  const [a1, a2, a3] = asks;

  const depthChartData = useMemo(() => {
    return [
      {
        name: b3.price.toFixed(2),
        [t("trading.buy")]: b3.volume,
        [t("trading.sell")]: 0,
      },
      {
        name: b2.price.toFixed(2),
        [t("trading.buy")]: b2.volume,
        [t("trading.sell")]: 0,
      },
      {
        name: b1.price.toFixed(2),
        [t("trading.buy")]: b1.volume,
        [t("trading.sell")]: 0,
      },
      {
        name: a1.price.toFixed(2),
        [t("trading.buy")]: 0,
        [t("trading.sell")]: a1.volume,
      },
      {
        name: a2.price.toFixed(2),
        [t("trading.buy")]: 0,
        [t("trading.sell")]: a2.volume,
      },
      {
        name: a3.price.toFixed(2),
        [t("trading.buy")]: 0,
        [t("trading.sell")]: a3.volume,
      },
    ];
  }, [b1, b2, b3, a1, a2, a3, t]);

  return (
    <div className="bg-gray-55/30 flex h-full flex-col justify-between rounded-lg border border-gray-200 p-3 lg:col-span-3 dark:border-slate-900 dark:bg-slate-900/10">
      <div>
        <h3 className="mb-2 text-center text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-slate-400">
          {t("trading.depthTitle")}
        </h3>

        {/* Depth Table */}
        <table className="w-full border-collapse font-mono text-xs select-none">
          <thead>
            <tr className="dark:text-slate-505 border-b border-gray-200 text-center font-sans text-[11px] text-gray-500 dark:border-slate-900">
              <th className="pb-1 text-left">{t("trading.bidVol")}</th>
              <th className="pb-1">{t("trading.bidPrice")}</th>
              <th className="pb-1">{t("trading.askPrice")}</th>
              <th className="pb-1 text-right">{t("trading.askVol")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-slate-900/40">
            <tr>
              <td className="py-1.5 text-left text-gray-600 dark:text-slate-400">
                {b3.volume.toLocaleString("vi-VN")}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(b3.price, tc, tran, san)}`}
              >
                {b3.price.toFixed(2)}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(a1.price, tc, tran, san)}`}
              >
                {a1.price.toFixed(2)}
              </td>
              <td className="py-1.5 text-right text-gray-600 dark:text-slate-400">
                {a1.volume.toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-left text-gray-600 dark:text-slate-400">
                {b2.volume.toLocaleString("vi-VN")}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(b2.price, tc, tran, san)}`}
              >
                {b2.price.toFixed(2)}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(a2.price, tc, tran, san)}`}
              >
                {a2.price.toFixed(2)}
              </td>
              <td className="py-1.5 text-right text-gray-600 dark:text-slate-400">
                {a2.volume.toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-left text-gray-600 dark:text-slate-400">
                {b1.volume.toLocaleString("vi-VN")}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(b1.price, tc, tran, san)}`}
              >
                {b1.price.toFixed(2)}
              </td>
              <td
                className={`py-1.5 text-center ${getPriceColor(a3.price, tc, tran, san)}`}
              >
                {a3.price.toFixed(2)}
              </td>
              <td className="py-1.5 text-right text-gray-600 dark:text-slate-400">
                {a3.volume.toLocaleString("vi-VN")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Volume buy/sell balances */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between font-sans text-[11px] font-bold text-gray-500 uppercase dark:text-slate-400">
            <span>
              {t("trading.bidRemaining")}: {totalBuyVol.toLocaleString("vi-VN")}
            </span>
            <span>
              {t("trading.askRemaining")}:{" "}
              {totalSellVol.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="bg-gray-155 flex h-2 overflow-hidden rounded-full dark:bg-slate-900">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${(totalBuyVol / (totalBuyVol + totalSellVol || 1)) * 100}%`,
              }}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{
                width: `${(totalSellVol / (totalBuyVol + totalSellVol || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Depth Histogram Chart */}
      <div className="mt-5 border-t border-gray-200 pt-3 dark:border-slate-900/60">
        <span className="text-gray-550 mb-1 block text-center font-sans text-[8px] font-semibold uppercase dark:text-slate-500">
          {t("trading.depthChart")}
        </span>
        {isMounted ? (
          <ResponsiveContainer width="100%" height={90} minWidth={0}>
            <BarChart data={depthChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 8 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  fontSize: "9px",
                }}
              />
              <Bar dataKey={t("trading.buy")} fill="#10b981" />
              <Bar dataKey={t("trading.sell")} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="bg-gray-155 h-[90px] w-full animate-pulse rounded dark:bg-slate-900/40" />
        )}
      </div>
    </div>
  );
}
