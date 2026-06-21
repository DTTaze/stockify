export const EXCHANGE_LIMITS = {
  HOSE: 0.07,
  HNX: 0.1,
  UPCOM: 0.15,
} as const;

export const DEPTH_VOLUME_MULTIPLIER = 1000;
export const DEPTH_DEALS_COUNT = 11;
export const DEFAULT_EXCHANGE = "HOSE";

// Coefficients for deterministic code weights
const COEFF_B1 = 17;
const COEFF_B2 = 29;
const COEFF_B3 = 41;
const COEFF_A1 = 13;
const COEFF_A2 = 37;
const COEFF_A3 = 53;

const MOD_B1 = 450;
const MOD_B2 = 350;
const MOD_B3 = 250;
const MOD_A1 = 420;
const MOD_A2 = 310;
const MOD_A3 = 220;

export interface PriceLimits {
  tc: number;
  tran: number;
  san: number;
}

export interface QuoteDepthItem {
  price: number;
  volume: number;
}

export interface OrderBookSimulation {
  bids: QuoteDepthItem[];
  asks: QuoteDepthItem[];
  totalBuyVol: number;
  totalSellVol: number;
}

export interface SimulatedMatchLog {
  time: string;
  price: number;
  volume: number;
  change: number;
  type: "M" | "B";
}

/**
 * Calculates reference price (TC), ceiling price (tran), and floor price (san)
 * based on the stock's exchange logic limit.
 */
export function calculatePriceLimits(
  price: number,
  change: number,
  exchange: string,
): PriceLimits {
  const tc = price / (1 + change / 100);
  const key = exchange as keyof typeof EXCHANGE_LIMITS;
  const limit = EXCHANGE_LIMITS[key] ?? EXCHANGE_LIMITS.HOSE;

  const tran = Math.round(tc * (1 + limit) * 100) / 100;
  const san = Math.round(tc * (1 - limit) * 100) / 100;

  return { tc, tran, san };
}

/**
 * Simulates deterministic buy/sell order book depth for a symbol code and current price.
 */
export function simulateOrderBook(
  symbol: string,
  price: number,
  tran: number,
  san: number,
): OrderBookSimulation {
  const codeWeight = symbol.charCodeAt(0) + (symbol.charCodeAt(1) || 0);

  const b1p = Math.max(san, Math.round((price - 0.05) * 100) / 100);
  const b1v = ((codeWeight * COEFF_B1) % MOD_B1) + 10;
  const b2p = Math.max(san, Math.round((price - 0.1) * 100) / 100);
  const b2v = ((codeWeight * COEFF_B2) % MOD_B2) + 5;
  const b3p = Math.max(san, Math.round((price - 0.15) * 100) / 100);
  const b3v = ((codeWeight * COEFF_B3) % MOD_B3) + 5;

  const a1p = Math.min(tran, Math.round((price + 0.05) * 100) / 100);
  const a1v = ((codeWeight * COEFF_A1) % MOD_A1) + 8;
  const a2p = Math.min(tran, Math.round((price + 0.1) * 100) / 100);
  const a2v = ((codeWeight * COEFF_A2) % MOD_A2) + 6;
  const a3p = Math.min(tran, Math.round((price + 0.15) * 100) / 100);
  const a3v = ((codeWeight * COEFF_A3) % MOD_A3) + 4;

  const totalBuyVol = (b1v + b2v + b3v) * DEPTH_VOLUME_MULTIPLIER;
  const totalSellVol = (a1v + a2v + a3v) * DEPTH_VOLUME_MULTIPLIER;

  return {
    bids: [
      { price: b1p, volume: b1v },
      { price: b2p, volume: b2v },
      { price: b3p, volume: b3v },
    ],
    asks: [
      { price: a1p, volume: a1v },
      { price: a2p, volume: a2v },
      { price: a3p, volume: a3v },
    ],
    totalBuyVol,
    totalSellVol,
  };
}

/**
 * Simulates trade logs showing matched history entries.
 */
export function simulateMatchHistory(
  symbol: string,
  price: number,
  change: number,
  tran: number,
  san: number,
): SimulatedMatchLog[] {
  const codeWeight = symbol.charCodeAt(0) + (symbol.charCodeAt(1) || 0);
  const records: SimulatedMatchLog[] = [];
  const now = new Date();

  for (let i = 0; i < DEPTH_DEALS_COUNT; i++) {
    const timeStr = new Date(now.getTime() - i * 15000).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      },
    );

    const isTradeBuy = (codeWeight + i) % 2 === 0;
    const tradePrice = price + (isTradeBuy ? 0.05 : -0.05) * ((i % 3) - 1);
    const tradeVol = (((codeWeight * (i + 1)) % 15) + 1) * 100;

    records.push({
      time: timeStr,
      price: Math.max(san, Math.min(tran, tradePrice)),
      volume: tradeVol,
      change: change + (isTradeBuy ? 0.1 : -0.1) * (i % 2),
      type: isTradeBuy ? "M" : "B",
    });
  }

  return records;
}

/**
 * Computes daily high and low prices.
 */
export function calculateHighLow(price: number): {
  highPrice: number;
  lowPrice: number;
} {
  const highPrice = Math.round(price * 1.03 * 100) / 100;
  const lowPrice = Math.round(price * 0.985 * 100) / 100;
  return { highPrice, lowPrice };
}
