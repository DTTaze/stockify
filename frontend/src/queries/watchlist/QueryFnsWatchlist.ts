import {
  getMarketListHandlers,
  getWatchlistHandlers,
  MarketListItem,
  WatchlistItemRaw,
} from "@/services/watchlist/watchlistHandlers";

export const getWatchlistQueryFn = async (): Promise<WatchlistItemRaw[]> => {
  const response = await getWatchlistHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch watchlist");
  }

  return response.data;
};

export const getMarketListQueryFn = async (
  type: string,
): Promise<MarketListItem[]> => {
  const response = await getMarketListHandlers(type);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch market list");
  }

  return response.data;
};
