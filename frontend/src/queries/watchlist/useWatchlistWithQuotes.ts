import { useQueries } from "@tanstack/react-query";

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

export function useWatchlistWithQuotes() {
  const { data: watchlistItems = [], isLoading: isWatchlistLoading } =
    useQueryWatchlist();

  const quoteQueries = useQueries({
    queries: watchlistItems.map((item) => ({
      queryKey: [
        QueryKeysStocks.ROOT,
        QueryKeysStocks.QUOTE,
        item.symbol,
        MarketType.STOCK,
        TimePeriod.ONE_DAY,
      ],
      queryFn: () =>
        getIndexQuoteQueryFn({
          symbol: item.symbol,
          type: MarketType.STOCK,
          period: TimePeriod.ONE_DAY,
        }),
      initialData: initialDataQuote,
    })),
  });

  const watchlist: WatchlistQuoteItem[] = watchlistItems.map((item, i) => {
    const queryResult = quoteQueries[i];
    const quote = queryResult?.data || initialDataQuote;
    return {
      id: item.id,
      symbol: item.symbol,
      name: quote?.symbol || item.symbol,
      price: quote?.price || 0,
      change: quote?.change_percent || 0,
      volume: quote?.volume || 0,
      prediction:
        (quote?.change_percent || 0) >= 0
          ? PredictionTrend.UP
          : PredictionTrend.DOWN,
    };
  });

  const isLoading =
    isWatchlistLoading || quoteQueries.some((q) => q?.isLoading);

  return {
    watchlist,
    watchlistSymbols: new Set(watchlistItems.map((i) => i.symbol)),
    isLoading,
  };
}
