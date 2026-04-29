import { ApiResponse } from "@/types/api";

export type WatchlistItemRaw = {
  id: string;
  symbol: string;
  userId: string;
};

export type MarketListItem = {
  symbol: string;
  description: string | null;
};

export type WatchlistMutationResponse = ApiResponse<void>;
