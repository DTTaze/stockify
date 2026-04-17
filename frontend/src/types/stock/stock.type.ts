export interface StockDataType {
  code: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  timestamp: string;
}

export interface StockHistoricalDataType {
  date: string;
  open: number;
  low: number;
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
