import { IndicatorStatus } from "@/types/stock/stock.type";

export function calculateSMA(prices: number[], period: number) {
  if (prices.length < period) {
    return null;
  }

  const slice = prices.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);

  return sum / period;
}

export function calculateEMA(prices: number[], period: number) {
  if (prices.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);

  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
}

export function calculateRSI(prices: number[], period = 14) {
  if (prices.length <= period) {
    return null;
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];

    if (diff > 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];

    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;

  return 100 - 100 / (1 + rs);
}

export function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (ema12 === null || ema26 === null) {
    return null;
  }

  return ema12 - ema26;
}

export const getStatusColor = (status: IndicatorStatus) => {
  switch (status) {
    case IndicatorStatus.BULLISH:
      return "bg-green-50 text-green-700 border-green-200";

    case IndicatorStatus.BEARISH:
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
};

export const getStatusText = (status: IndicatorStatus) => {
  switch (status) {
    case IndicatorStatus.BULLISH:
      return "Tăng";

    case IndicatorStatus.BEARISH:
      return "Giảm";

    default:
      return "Trung tính";
  }
};

export const getStatusDot = (status: IndicatorStatus) => {
  switch (status) {
    case IndicatorStatus.BULLISH:
      return "bg-green-500";

    case IndicatorStatus.BEARISH:
      return "bg-red-500";

    default:
      return "bg-yellow-500";
  }
};
