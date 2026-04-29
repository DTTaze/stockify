import { useQueries } from "@tanstack/react-query";

import { getIndexQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { QueryKeysStocks } from "@/queries/stocks/QueryKeysStocks";
import { MarketType, StockDataType, TimePeriod } from "@/types/stock/stock.type";

import { useQueryWatchlist } from "./QueryHooksWatchlist";

export interface WatchlistQuoteItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  prediction: string;
}

export function useWatchlistWithQuotes() {
  const { data: watchlistItems = [] } = useQueryWatchlist();

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
      initialData: {
        code: item.symbol,
        name: item.symbol,
        price: 0,
        change: 0,
        change_percent: 0,
        high: 0,
        low: 0,
        open: 0,
        volume: 0,
        timestamp: "",
      } satisfies StockDataType,
    })),
  });

  const watchlist: WatchlistQuoteItem[] = watchlistItems.map((item, i) => {
    const quote = quoteQueries[i].data;
    return {
      id: item.id,
      symbol: item.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change_percent,
      volume: quote.volume,
      prediction: quote.change_percent >= 0 ? "Tăng" : "Giảm",
    };
  });

  return {
    watchlist,
    watchlistSymbols: new Set(watchlistItems.map((i) => i.symbol)),
  };
}
