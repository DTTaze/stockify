import { ApiResponse } from "@/types/api";
import {
  DataManagementStocksType,
  DataManagementSummaryType,
  DataManagementUpdateAllResponseType,
  DataManagementUpdateResponseType,
} from "@/types/ml/dataManagement.type";

import { dataManagementServices } from ".";

export const getDataManagementSummaryHandlers = async (): Promise<
  ApiResponse<DataManagementSummaryType>
> => {
  const response = await dataManagementServices.getSummary();
  return response.data;
};

export const getDataManagementStocksHandlers = async (params?: {
  keyword?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<DataManagementStocksType>> => {
  const response = await dataManagementServices.getStocks(params);
  return response.data;
};

export const updateStockDataHandlers = async (
  symbol: string,
): Promise<ApiResponse<DataManagementUpdateResponseType>> => {
  const response = await dataManagementServices.updateStock(symbol);
  return response.data;
};

export const updateAllDataHandlers = async (): Promise<
  ApiResponse<DataManagementUpdateAllResponseType>
> => {
  const response = await dataManagementServices.updateAll();
  return response.data;
};
