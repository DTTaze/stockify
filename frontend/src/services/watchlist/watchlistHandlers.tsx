import { ApiResponse } from "@/types/api";
import {
  MarketListItem,
  WatchlistItemRaw,
} from "@/types/watchlist/watchlist.type";

import { watchlistServices } from ".";

export const getWatchlistHandlers = async (): Promise<
  ApiResponse<WatchlistItemRaw[]>
> => {
  const response = await watchlistServices.getWatchlist();
  return response.data;
};

export const addToWatchlistHandlers = async (symbol: string): Promise<void> => {
  const data = (await watchlistServices.addToWatchlist(symbol)).data;
  if (!data.success) {
    throw new Error(data.message);
  }
};

export const removeFromWatchlistHandlers = async (symbol: string): Promise<void> => {
  const data = (await watchlistServices.removeFromWatchlist(symbol)).data;
  if (!data.success) {
    throw new Error(data.message);
  }
};

export const getMarketListHandlers = async (
  type: string,
): Promise<ApiResponse<MarketListItem[]>> => {
  const response = await watchlistServices.getMarketList(type);
  return response.data;
};
