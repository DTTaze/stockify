import { Activity, BarChart3, TrendingUp } from "lucide-react";

import {
  IndicatorStatus,
  StockHistoricalDataType,
} from "@/types/stock/stock.type";
import {
  calculateEMA,
  calculateMACD,
  calculateRSI,
  calculateSMA,
} from "@/utils/technicalIndicator";

export function computeTechnicalIndicators(
  historicalData: StockHistoricalDataType[],
) {
  const prices = historicalData.map((item) => item.close);
  if (!prices.length) {
    return [];
  }

  const latestPrice = prices[prices.length - 1];
  const ma20 = calculateSMA(prices, 20);
  const ema50 = calculateEMA(prices, 50);
  const rsi14 = calculateRSI(prices, 14);
  const macd = calculateMACD(prices);

  return [
    {
      name: "MA(20)",
      value: ma20?.toFixed(2) ?? "--",
      status:
        ma20 === null
          ? IndicatorStatus.NEUTRAL
          : latestPrice > ma20
            ? IndicatorStatus.BULLISH
            : IndicatorStatus.BEARISH,
      icon: TrendingUp,
      description: "Đường trung bình động (MA20)",
    },
    {
      name: "EMA(50)",
      value: ema50?.toFixed(2) ?? "--",
      status:
        ema50 === null
          ? IndicatorStatus.NEUTRAL
          : latestPrice > ema50
            ? IndicatorStatus.BULLISH
            : IndicatorStatus.BEARISH,
      icon: TrendingUp,
      description: "Đường trung bình lũy thừa (EMA50)",
    },
    {
      name: "RSI(14)",
      value: rsi14?.toFixed(2) ?? "--",
      status:
        rsi14 === null
          ? IndicatorStatus.NEUTRAL
          : rsi14 > 70
            ? IndicatorStatus.BEARISH
            : rsi14 < 30
              ? IndicatorStatus.BULLISH
              : IndicatorStatus.NEUTRAL,
      icon: Activity,
      description: "Chỉ số sức mạnh tương đối (RSI)",
    },
    {
      name: "MACD",
      value: macd?.toFixed(2) ?? "--",
      status:
        macd === null
          ? IndicatorStatus.NEUTRAL
          : macd > 0
            ? IndicatorStatus.BULLISH
            : IndicatorStatus.BEARISH,
      icon: BarChart3,
      description: "Đường hội tụ phân kỳ (MACD)",
    },
  ];
}
