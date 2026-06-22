import { useQueries } from "@tanstack/react-query";

import { MARKET_INDICES } from "@/constants/stock";
import { getIndexQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { initialStockData } from "@/queries/stocks/QueryHooksStocks";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

export function useMarketIndices() {
  const queries = useQueries({
    queries: MARKET_INDICES.map(({ symbol }) => ({
      queryKey: ["index-quote", symbol],
      queryFn: () =>
        getIndexQuoteQueryFn({
          symbol,
          type: MarketType.INDEX,
          period: TimePeriod.ONE_DAY,
        }),
      refetchInterval: 10000, // Refetch every 10 seconds for real-time feel
    })),
  });

  const isLoading = queries.some((q) => q.isLoading || !q.data);

  const indices = MARKET_INDICES.map(({ label }, index) => ({
    label,
    data: queries[index].data ?? initialStockData,
  }));

  return { indices, isLoading };
}
