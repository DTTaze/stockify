import { TimePeriod } from "@/types/stock/stock.type";

export const TIME_RANGE_MAP: Record<string, TimePeriod> = {
  "1D": TimePeriod.ONE_DAY,
  "1W": TimePeriod.ONE_WEEK,
  "1M": TimePeriod.ONE_MONTH,
  "3M": TimePeriod.THREE_MONTH,
  "6M": TimePeriod.SIX_MONTH,
  "1Y": TimePeriod.ONE_YEAR,
};

export const getPriceColor = (
  val: number,
  tc: number,
  tran: number,
  san: number,
) => {
  if (val >= tran) {
    return "text-fuchsia-600 dark:text-fuchsia-400 font-semibold";
  }
  if (val <= san) {
    return "text-cyan-600 dark:text-cyan-400 font-semibold";
  }
  if (Math.abs(val - tc) < 0.015) {
    return "text-amber-500 dark:text-yellow-400";
  }
  return val > tc
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
};

export const getQuoteColor = (change: number) => {
  if (change === 0) {
    return "text-amber-500 dark:text-yellow-400 font-bold";
  }
  return change > 0
    ? "text-emerald-600 dark:text-green-400 font-bold"
    : "text-red-600 dark:text-red-500 font-bold";
};
