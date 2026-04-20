import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToWatchlistHandlers,
  removeFromWatchlistHandlers,
  WatchlistItemRaw,
} from "@/services/watchlist/watchlistHandlers";

import { getWatchlistQueryFn } from "./QueryFnsWatchlist";
import { QueryKeysWatchlist } from "./QueryKeysWatchlist";

export const useQueryWatchlist = () =>
  useQuery<WatchlistItemRaw[]>({
    queryKey: [QueryKeysWatchlist.ROOT],
    queryFn: getWatchlistQueryFn,
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
