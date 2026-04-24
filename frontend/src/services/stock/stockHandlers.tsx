import { ApiResponse } from "@/types/api";
import {
  MarketQuoteParams,
  StockCompaniesDataType,
  StockDataType,
  StockHistoricalDataType,
} from "@/types/stock/stock.type";

import { stockServices } from ".";

export const getIndexQuoteHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockDataType>> => {
  const response = await stockServices.getIndexQuote(params);

  return response.data;
};

export const getQuoteHistoricalHandlers = async (
  params: MarketQuoteParams,
): Promise<ApiResponse<StockHistoricalDataType[]>> => {
  const response = await stockServices.getQuoteHistorical(params);

  return response.data;
};

export const getStockCompaniesHandlers = async (): Promise<
  ApiResponse<StockCompaniesDataType[]>
> => {
  const response = await stockServices.getStockCompanies();

  return response.data;
};
