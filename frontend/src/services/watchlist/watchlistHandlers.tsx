import {
  MarketListItem,
  WatchlistItemRaw,
} from "@/types/watchlist/watchlist.type";

import { watchlistServices } from ".";

export const getWatchlistHandlers = async (): Promise<WatchlistItemRaw[]> => {
  const data = (await watchlistServices.getWatchlist()).data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
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
): Promise<MarketListItem[]> => {
  const data = (await watchlistServices.getMarketList(type)).data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
