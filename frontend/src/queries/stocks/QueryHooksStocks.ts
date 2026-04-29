import { useQuery } from "@tanstack/react-query";

import {
  MarketQuoteParams,
  StockCompaniesDataType,
  StockDataType,
  StockHistoricalDataType,
  StockPrediction,
  SupportedSymbolsType,
} from "@/types/stock/stock.type";

import {
  getIndexQuoteQueryFn,
  getPredictionQueryFn,
  getQuoteHistoricalQueryFn,
  getStockCompaniesQueryFn,
  getSupportedSymbolsQueryFn,
} from "./QueryFnsStocks";
import { QueryKeysStocks } from "./QueryKeysStocks";

export const initialStockData: StockDataType = {
  symbol: "",
  price: 0,
  change_percent: 0,
  volume: 0,
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

export const useQueryPrediction = (symbol: string, enabled?: boolean) =>
  useQuery<StockPrediction>({
    queryKey: [QueryKeysStocks.ROOT, QueryKeysStocks.PREDICTION, symbol],
    queryFn: () => getPredictionQueryFn(symbol),
    enabled: enabled !== undefined ? enabled : !!symbol,
    refetchOnMount: true,
  });

export const useQuerySupportedSymbols = () =>
  useQuery<SupportedSymbolsType>({
    queryKey: [QueryKeysStocks.ROOT, QueryKeysStocks.SUPPORTED_SYMBOLS],
    queryFn: () => getSupportedSymbolsQueryFn(),
    refetchOnMount: true,
  });
