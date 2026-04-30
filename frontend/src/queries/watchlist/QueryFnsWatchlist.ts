import {
  getMarketListHandlers,
  getWatchlistHandlers,
} from "@/services/watchlist/watchlistHandlers";
import {
  MarketListItem,
  WatchlistItemRaw,
} from "@/types/watchlist/watchlist.type";

export const getWatchlistQueryFn = (): Promise<WatchlistItemRaw[]> =>
  getWatchlistHandlers();

export const getMarketListQueryFn = (type: string): Promise<MarketListItem[]> =>
  getMarketListHandlers(type);
