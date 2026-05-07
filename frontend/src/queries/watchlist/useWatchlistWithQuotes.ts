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
      initialData: initialDataQuote,
    })),
  });

  const watchlist: WatchlistQuoteItem[] = watchlistItems.map((item, i) => {
    const quote = quoteQueries[i].data;
    return {
      id: item.id,
      symbol: item.symbol,
      name: quote.symbol,
      price: quote.price,
      change: quote.change_percent,
      volume: quote.volume,
      prediction:
        quote.change_percent >= 0 ? PredictionTrend.UP : PredictionTrend.DOWN,
    };
  });

  return {
    watchlist,
    watchlistSymbols: new Set(watchlistItems.map((i) => i.symbol)),
  };
}
