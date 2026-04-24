import { useQuery } from "@tanstack/react-query";

import {
  MarketQuoteParams,
  StockCompaniesDataType,
  StockDataType,
  StockHistoricalDataType,
} from "@/types/stock/stock.type";

import {
  getIndexQuoteQueryFn,
  getQuoteHistoricalQueryFn,
  getStockCompaniesQueryFn,
} from "./QueryFnsStocks";
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

export const useQueryIndexQuote = (params: MarketQuoteParams) =>
  useQuery<StockDataType>({
    queryKey: [
      QueryKeysStocks.ROOT,
      QueryKeysStocks.QUOTE,
      params.symbol,
      params.type,
      params.period,
    ],
    queryFn: () => getIndexQuoteQueryFn(params),
    placeholderData: initialStockData,
    refetchOnMount: true,
  });

export const useQueryQuoteHistorical = (params: MarketQuoteParams) =>
  useQuery<StockHistoricalDataType[]>({
    queryKey: [
      QueryKeysStocks.ROOT,
      QueryKeysStocks.HISTORICAL,
      params.symbol,
      params.type,
      params.period,
    ],
    queryFn: () => getQuoteHistoricalQueryFn(params),
    refetchOnMount: true,
  });

export const useQueryStockCompanies = () =>
  useQuery<StockCompaniesDataType[]>({
    queryKey: [QueryKeysStocks.ROOT, QueryKeysStocks.COMPANIES],
    queryFn: () => getStockCompaniesQueryFn(),
    refetchOnMount: true,
  });
