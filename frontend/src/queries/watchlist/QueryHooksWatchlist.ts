import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToWatchlistHandlers,
  MarketListItem,
  removeFromWatchlistHandlers,
  WatchlistItemRaw,
} from "@/services/watchlist/watchlistHandlers";

import { getMarketListQueryFn, getWatchlistQueryFn } from "./QueryFnsWatchlist";
import { QueryKeysWatchlist } from "./QueryKeysWatchlist";

export const useQueryWatchlist = () =>
  useQuery<WatchlistItemRaw[]>({
    queryKey: [QueryKeysWatchlist.ROOT],
    queryFn: getWatchlistQueryFn,
  });

export const useQueryMarketList = (type: string, enabled: boolean) =>
  useQuery<MarketListItem[]>({
    queryKey: [QueryKeysWatchlist.ROOT, QueryKeysWatchlist.MARKET_LIST, type],
    queryFn: () => getMarketListQueryFn(type),
    enabled,
  });

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => addToWatchlistHandlers(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysWatchlist.ROOT] });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => removeFromWatchlistHandlers(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysWatchlist.ROOT] });
    },
  });
};
