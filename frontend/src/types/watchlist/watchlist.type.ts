import { PredictionTrend } from "@/constants/stock";
import { ApiResponse } from "@/types/api";

export type WatchlistItemRaw = {
  id: string;
  symbol: string;
  userId: string;
};

export type MarketListItem = {
  symbol: string;
  description: string;
};

export type WatchlistMutationResponse = ApiResponse<void>;

export interface WatchlistQuoteItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  prediction: PredictionTrend;
}

export interface PurchaseTransaction {
  id: string;
  symbol: string;
  purchaseDate: string; // "YYYY-MM-DD"
  quantity: number;
  price: number;
}
