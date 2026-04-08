import { useQuery } from "@tanstack/react-query";

import { getIndexQuoteQueryFn } from "./QueryFnsStocks";
import { QueryKeysStocks } from "./QueryKeysStocks";

export const initialStockData: StockDataType = {
  code: "",
  name: "",
  price: 0,
  change: 0,
  change_percent: 0,
  high: 0,
  low: 0,
  open: 0,
  volume: 0,
  timestamp: "",
};

export const useQueryIndexQuote = (indexCode: string) =>
  useQuery<StockDataType>({
    queryKey: [QueryKeysStocks.STOCK, QueryKeysStocks.STOCK_INDICES, indexCode],
    queryFn: () => getIndexQuoteQueryFn(indexCode),
    placeholderData: initialStockData,
    refetchOnMount: true,
  });
