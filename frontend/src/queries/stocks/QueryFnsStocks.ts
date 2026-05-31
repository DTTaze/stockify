import {
  getClassificationSummaryHandlers,
  getFuturesHandlers,
  getGovernmentBondsHandlers,
  getIcbIndustriesHandlers,
  getIcbStocksHandlers,
  getIndexQuoteHandlers,
  getIndicesHandlers,
  getMarketGroupsHandlers,
  getPredictionHandlers,
  getQuoteHistoricalHandlers,
  getStockCompaniesHandlers,
  getStockHistoricalHandlers,
  getStockQuoteHandlers,
  getStocksHandlers,
  getSupportedSymbolsHandlers,
  getTickerCategoriesHandlers,
  syncAllCategoriesHandlers,
  syncClassificationsHandlers,
  syncIcbIndustriesHandlers,
  syncMarketGroupsHandlers,
} from "@/services/stock/stockHandlers";
import {
  ClassificationStock,
  ClassificationSummary,
  IcbIndustry,
  MarketQuoteParams,
  StockCompaniesDataType,
  StockDataType,
  StockHistoricalDataType,
  StockPrediction,
  SupportedSymbolsType,
} from "@/types/stock/stock.type";

export const getIndexQuoteQueryFn = async (
  params: MarketQuoteParams,
): Promise<StockDataType> => {
  const response = await getIndexQuoteHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch index quote");
  }

  return response.data;
};

export const getStockQuoteQueryFn = async (
  params: MarketQuoteParams,
): Promise<StockDataType> => {
  const response = await getStockQuoteHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch stock quote");
  }

  return response.data;
};

export const getQuoteHistoricalQueryFn = async (
  params: MarketQuoteParams,
): Promise<StockHistoricalDataType[]> => {
  const response = await getQuoteHistoricalHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch index quote");
  }

  return response.data;
};

export const getStockHistoricalQueryFn = async (
  params: MarketQuoteParams,
): Promise<StockHistoricalDataType[]> => {
  const response = await getStockHistoricalHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch stock historical");
  }

  return response.data;
};

export const getStockCompaniesQueryFn = async (): Promise<
  StockCompaniesDataType[]
> => {
  const response = await getStockCompaniesHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch stock companies");
  }

  return response.data;
};

export const getPredictionQueryFn = async (
  symbol: string,
): Promise<StockPrediction> => {
  const response = await getPredictionHandlers(symbol);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch prediction");
  }

  return response.data;
};

export const getSupportedSymbolsQueryFn =
  async (): Promise<SupportedSymbolsType> => {
    const response = await getSupportedSymbolsHandlers();

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch supported symbols");
    }

    return response.data;
  };

export const getStocksQueryFn = async (params?: {
  group?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}): Promise<{ rows: ClassificationStock[]; total: number }> => {
  const response = await getStocksHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch stocks");
  }

  return response.data;
};

export const syncClassificationsQueryFn = async (): Promise<unknown> => {
  const response = await syncClassificationsHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to sync stock classifications");
  }

  return response.data;
};

export const getClassificationSummaryQueryFn =
  async (): Promise<ClassificationSummary> => {
    const response = await getClassificationSummaryHandlers();

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch classification summary",
      );
    }

    return response.data;
  };

export const getMarketGroupsQueryFn = async (): Promise<unknown> => {
  const response = await getMarketGroupsHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch market groups");
  }
  return response.data;
};

export const getIcbIndustriesQueryFn = async (params?: {
  level?: number;
}): Promise<IcbIndustry[]> => {
  const response = await getIcbIndustriesHandlers(params);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch ICB industries");
  }
  return response.data;
};

export const getIcbStocksQueryFn = async (
  icbCode: string,
  params?: { keyword?: string; limit?: number; offset?: number },
): Promise<{ rows: ClassificationStock[]; total: number }> => {
  const response = await getIcbStocksHandlers(icbCode, params);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch ICB stocks");
  }
  return response.data;
};

export const getTickerCategoriesQueryFn = async (
  ticker: string,
): Promise<unknown> => {
  const response = await getTickerCategoriesHandlers(ticker);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch ticker categories");
  }
  return response.data;
};

export const syncMarketGroupsQueryFn = async (): Promise<unknown> => {
  const response = await syncMarketGroupsHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to sync market groups");
  }
  return response.data;
};

export const syncIcbIndustriesQueryFn = async (): Promise<unknown> => {
  const response = await syncIcbIndustriesHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to sync ICB industries");
  }
  return response.data;
};

export const syncAllCategoriesQueryFn = async (): Promise<unknown> => {
  const response = await syncAllCategoriesHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to sync all categories");
  }
  return response.data;
};

export const getFuturesQueryFn = async (): Promise<string[]> => {
  const response = await getFuturesHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch futures symbols");
  }
  return response.data || [];
};

export const getGovernmentBondsQueryFn = async (): Promise<string[]> => {
  const response = await getGovernmentBondsHandlers();
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch government bonds symbols",
    );
  }
  return response.data || [];
};

export const getIndicesQueryFn = async (): Promise<string[]> => {
  const response = await getIndicesHandlers();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch indices symbols");
  }
  return response.data || [];
};
