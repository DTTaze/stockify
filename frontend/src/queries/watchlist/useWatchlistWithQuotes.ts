import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import { PredictionTrend } from "@/constants/stock";
import { getIndexQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { QueryKeysStocks } from "@/queries/stocks/QueryKeysStocks";
import {
  MarketType,
  StockDataType,
  TimePeriod,
} from "@/types/stock/stock.type";
import { WatchlistQuoteItem } from "@/types/watchlist/watchlist.type";

import { useQueryWatchlist } from "./QueryHooksWatchlist";

export const initialDataQuote: StockDataType = {
  symbol: "",
  price: 0,
  change_percent: 0,
  volume: 0,
};

export function useWatchlistWithQuotes(
  customSymbolsOrEnabled?: string[] | boolean,
  enabledArg = true,
) {
  const customSymbols = useMemo(() => {
    return Array.isArray(customSymbolsOrEnabled)
      ? customSymbolsOrEnabled
      : undefined;
  }, [customSymbolsOrEnabled]);

  const enabled = useMemo(() => {
    return typeof customSymbolsOrEnabled === "boolean"
      ? customSymbolsOrEnabled
      : enabledArg;
  }, [customSymbolsOrEnabled, enabledArg]);

  const { data: watchlistItems = [], isLoading: isWatchlistLoading } =
    useQueryWatchlist(enabled && !customSymbols);

  const finalSymbols = useMemo(() => {
    if (customSymbols) {
      return customSymbols;
    }
    return watchlistItems.map((item) => item.symbol);
  }, [customSymbols, watchlistItems]);

  const quoteQueries = useQueries({
    queries: enabled
      ? finalSymbols.map((symbol) => ({
          queryKey: [
            QueryKeysStocks.ROOT,
            QueryKeysStocks.QUOTE,
            symbol,
            MarketType.STOCK,
            TimePeriod.ONE_DAY,
          ],
          queryFn: () =>
            getIndexQuoteQueryFn({
              symbol: symbol,
              type: MarketType.STOCK,
              period: TimePeriod.ONE_DAY,
            }),
          initialData: initialDataQuote,
        }))
      : [],
  });

  const watchlist: WatchlistQuoteItem[] = useMemo(() => {
    return finalSymbols.map((symbol, i) => {
      const queryResult = quoteQueries[i];
      const quote = queryResult?.data || initialDataQuote;
      const dbItem = watchlistItems.find((item) => item.symbol === symbol);
      return {
        id: dbItem?.id || symbol,
        symbol: symbol,
        name: quote?.symbol || symbol,
        price: quote?.price || 0,
        change: quote?.change_percent || 0,
        volume: quote?.volume || 0,
        prediction:
          (quote?.change_percent || 0) >= 0
            ? PredictionTrend.UP
            : PredictionTrend.DOWN,
      };
    });
  }, [finalSymbols, quoteQueries, watchlistItems]);

  const isLoading =
    (!customSymbols && isWatchlistLoading) ||
    quoteQueries.some((q) => q?.isLoading);

  return {
    watchlist,
    watchlistSymbols: new Set(finalSymbols),
    isLoading,
  };
}
