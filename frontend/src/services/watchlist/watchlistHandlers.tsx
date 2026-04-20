import { ApiResponse } from "@/types/api";

import { watchlistServices } from ".";

export type WatchlistItemRaw = {
  id: string;
  symbol: string;
  userId: string;
};

export const getWatchlistHandlers = async (): Promise<
  ApiResponse<WatchlistItemRaw[]>
> => {
  const response = await watchlistServices.getWatchlist();
  return response.data;
};

export const addToWatchlistHandlers = async (
  symbol: string,
): Promise<ApiResponse<void>> => {
  const response = await watchlistServices.addToWatchlist(symbol);
  return response.data;
};

export const removeFromWatchlistHandlers = async (
  symbol: string,
): Promise<ApiResponse<void>> => {
  const response = await watchlistServices.removeFromWatchlist(symbol);
  return response.data;
};
