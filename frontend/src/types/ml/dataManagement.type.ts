import { StockStatus } from "@/constants/stock";

export type DataManagementSummaryType = {
  total_stocks: number;
  updated: number;
  needs_update: number;
  total_records: number;
};

export type DataManagementStockType = {
  symbol: string;
  last_updated: string;
  total_records: number;
  status: StockStatus;
};

export type DataManagementStocksType = {
  stocks: DataManagementStockType[];
  total: number;
  limit: number;
  offset: number;
};

export type DataManagementUpdateResponseType = {
  symbol: string;
  updated: boolean;
  message?: string;
  last_updated?: string;
};

export type DataManagementUpdateAllResponseType = {
  updated_count: number;
  updated_symbols: string[];
  message?: string;
};
