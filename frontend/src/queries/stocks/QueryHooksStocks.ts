import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MarketQuoteParams,
  StockCompaniesDataType,
  StockDataType,
  StockHistoricalDataType,
  StockPrediction,
  SupportedSymbolsType,
} from "@/types/stock/stock.type";

import {
  getClassificationSummaryQueryFn,
  getFuturesQueryFn,
  getGovernmentBondsQueryFn,
  getIcbIndustriesQueryFn,
  getIcbStocksQueryFn,
  getIndexQuoteQueryFn,
  getIndicesQueryFn,
  getMarketGroupsQueryFn,
  getPredictionQueryFn,
  getQuoteHistoricalQueryFn,
  getStockCompaniesQueryFn,
  getStocksQueryFn,
  getSupportedSymbolsQueryFn,
  getTickerCategoriesQueryFn,
  syncAllCategoriesQueryFn,
  syncClassificationsQueryFn,
  syncIcbIndustriesQueryFn,
  syncMarketGroupsQueryFn,
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

export const useQueryStocks = (params?: {
  group?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: [
      QueryKeysStocks.ROOT,
      "list",
      params?.group,
      params?.keyword,
      params?.offset,
      params?.limit,
    ],
    queryFn: () => getStocksQueryFn(params),
    refetchOnMount: true,
  });

export const useQueryClassificationSummary = () =>
  useQuery({
    queryKey: [QueryKeysStocks.ROOT, "classification-summary"],
    queryFn: getClassificationSummaryQueryFn,
    refetchOnMount: true,
  });

export const useSyncClassifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncClassificationsQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "classification-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "list"],
      });
    },
  });
};

export const useQueryMarketGroups = () =>
  useQuery({
    queryKey: [QueryKeysStocks.ROOT, "market-groups"],
    queryFn: getMarketGroupsQueryFn,
    refetchOnMount: true,
  });

export const useQueryIcbIndustries = (params?: { level?: number }) =>
  useQuery({
    queryKey: [QueryKeysStocks.ROOT, "icb-industries", params?.level],
    queryFn: () => getIcbIndustriesQueryFn(params),
    refetchOnMount: true,
  });

export const useQueryIcbStocks = (
  icbCode: string,
  params?: { keyword?: string; limit?: number; offset?: number },
) =>
  useQuery({
    queryKey: [
      QueryKeysStocks.ROOT,
      "icb-stocks",
      icbCode,
      params?.keyword,
      params?.limit,
      params?.offset,
    ],
    queryFn: () => getIcbStocksQueryFn(icbCode, params),
    enabled: !!icbCode,
    refetchOnMount: true,
  });

export const useQueryTickerCategories = (ticker: string) =>
  useQuery({
    queryKey: [QueryKeysStocks.ROOT, "ticker-categories", ticker],
    queryFn: () => getTickerCategoriesQueryFn(ticker),
    enabled: !!ticker,
    refetchOnMount: true,
  });

export const useSyncMarketGroups = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncMarketGroupsQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "classification-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "list"],
      });
    },
  });
};

export const useSyncIcbIndustries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncIcbIndustriesQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "icb-industries"],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT, "icb-stocks"],
      });
    },
  });
};

export const useSyncAllCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncAllCategoriesQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysStocks.ROOT],
      });
    },
  });
};

export const useQueryFutures = () =>
  useQuery<string[]>({
    queryKey: [QueryKeysStocks.ROOT, "futures"],
    queryFn: getFuturesQueryFn,
    refetchOnMount: true,
  });

export const useQueryGovernmentBonds = () =>
  useQuery<string[]>({
    queryKey: [QueryKeysStocks.ROOT, "government-bonds"],
    queryFn: getGovernmentBondsQueryFn,
    refetchOnMount: true,
  });

export const useQueryIndices = () =>
  useQuery<string[]>({
    queryKey: [QueryKeysStocks.ROOT, "indices"],
    queryFn: getIndicesQueryFn,
    refetchOnMount: true,
  });
