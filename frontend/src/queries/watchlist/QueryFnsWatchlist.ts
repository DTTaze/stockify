import {
  getWatchlistHandlers,
  WatchlistItemRaw,
} from "@/services/watchlist/watchlistHandlers";

export const getWatchlistQueryFn = async (): Promise<WatchlistItemRaw[]> => {
  const response = await getWatchlistHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch watchlist");
  }

  return response.data;
};
