import { TrendingUp } from "lucide-react";

export interface StockDataType {
  symbol: string;
  price: number;
  change_percent: number;
  volume: number;
}

export interface StockHistoricalDataType {
  date: string;
  close: number;
  volume: number;
}

export interface StockCompaniesDataType {
  symbol: string;
  organizationName: string;
}

export enum MarketType {
  STOCK = "stock",
  INDEX = "index",
}

export enum TimePeriod {
  ONE_DAY = "1d",
  ONE_WEEK = "1w",
  ONE_MONTH = "1mo",
  THREE_MONTH = "3mo",
  SIX_MONTH = "6mo",
  ONE_YEAR = "1y",
}

export interface MarketQuoteParams {
  symbol: string;
  type: MarketType;
  period: TimePeriod;
}

export enum IndicatorStatus {
  BULLISH = "bullish",
  BEARISH = "bearish",
  NEUTRAL = "neutral",
}

export interface IndicatorItem {
  name: string;
  value: string;
  status: IndicatorStatus;
  icon: typeof TrendingUp;
  description: string;
}

export interface StockPrediction {
  symbol: string;
  current_price: number;

  tomorrow: number;
  tomorrow_confidence: number;

  day3: number;
  day3_confidence: number;

  day7: number;
  day7_confidence: number;

  day14: number;
  day14_confidence: number;
}

export interface SupportedSymbolsType {
  symbols: string[];
}
