import { ApiResponse } from "@/types/api";
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

import { stockServices } from ".";

export const getIndexQuoteHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockDataType>> => {
  const response = await stockServices.getIndexQuote(params);

  return response.data;
};

export const getIndexHistoricalHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockHistoricalDataType[]>> => {
  const response = await stockServices.getIndexHistorical(params);

  return response.data;
};

export const getStockQuoteHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockDataType>> => {
  const response = await stockServices.getStockQuote(params);

  return response.data;
};

export const getQuoteHistoricalHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockHistoricalDataType[]>> => {
  const response = await stockServices.getQuoteHistorical(params);

  return response.data;
};

export const getStockHistoricalHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockHistoricalDataType[]>> => {
  const response = await stockServices.getStockHistorical(params);

  return response.data;
};

export const getStockCompaniesHandlers = async (): Promise<
  ApiResponse<StockCompaniesDataType[]>
> => {
  const response = await stockServices.getStockCompanies();

  return response.data;
};

export const getPredictionHandlers = async (
  symbol: string,
  modelType?: string,
): Promise<ApiResponse<StockPrediction>> => {
  const response = await stockServices.getPrediction(symbol, modelType);

  return response.data;
};

export const getSupportedSymbolsHandlers = async (): Promise<
  ApiResponse<SupportedSymbolsType>
> => {
  const response = await stockServices.getSupportedSymbols();

  return response.data;
};

export const getStocksHandlers = async (params?: {
  group?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}): Promise<ApiResponse<{ rows: ClassificationStock[]; total: number }>> => {
  const response = await stockServices.getStocks(params);

  return response.data;
};

export const syncClassificationsHandlers = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await stockServices.syncClassifications();

  return response.data;
};

export const getClassificationSummaryHandlers = async (): Promise<
  ApiResponse<ClassificationSummary>
> => {
  const response = await stockServices.getClassificationSummary();

  return response.data;
};

export const getMarketGroupsHandlers = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await stockServices.getMarketGroups();
  return response.data;
};

export const getIcbIndustriesHandlers = async (params?: {
  level?: number;
}): Promise<ApiResponse<IcbIndustry[]>> => {
  const response = await stockServices.getIcbIndustries(params);
  return response.data;
};

export const getIcbStocksHandlers = async (
  icbCode: string,
  params?: { keyword?: string; limit?: number; offset?: number },
): Promise<ApiResponse<{ rows: ClassificationStock[]; total: number }>> => {
  const response = await stockServices.getIcbStocks(icbCode, params);
  return response.data;
};

export const getTickerCategoriesHandlers = async (
  ticker: string,
): Promise<ApiResponse<unknown>> => {
  const response = await stockServices.getTickerCategories(ticker);
  return response.data;
};

export const getFuturesHandlers = async (): Promise<ApiResponse<string[]>> => {
  const response = await stockServices.getFutures();
  return response.data;
};

export const getGovernmentBondsHandlers = async (): Promise<
  ApiResponse<string[]>
> => {
  const response = await stockServices.getGovernmentBonds();
  return response.data;
};

export const getIndicesHandlers = async (): Promise<ApiResponse<string[]>> => {
  const response = await stockServices.getIndices();
  return response.data;
};

export const syncMarketGroupsHandlers = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await stockServices.syncMarketGroups();
  return response.data;
};

export const syncIcbIndustriesHandlers = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await stockServices.syncIcbIndustries();
  return response.data;
};

export const syncAllCategoriesHandlers = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await stockServices.syncAllCategories();
  return response.data;
};
