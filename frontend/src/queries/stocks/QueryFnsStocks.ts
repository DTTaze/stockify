import {
  getIndexQuoteHandlers,
  getPredictionHandlers,
  getQuoteHistoricalHandlers,
  getStockCompaniesHandlers,
  getSupportedSymbolsHandlers,
} from "@/services/stock/stockHandlers";
import {
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

export const getQuoteHistoricalQueryFn = async (
  params: MarketQuoteParams,
): Promise<StockHistoricalDataType[]> => {
  const response = await getQuoteHistoricalHandlers(params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch index quote");
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
