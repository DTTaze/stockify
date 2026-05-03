import {
  getDataManagementStocksHandlers,
  getDataManagementSummaryHandlers,
  updateAllDataHandlers,
  updateStockDataHandlers,
} from "@/services/data-management/dataManagementHandlers";
import {
  DataManagementStocksType,
  DataManagementSummaryType,
  DataManagementUpdateAllResponseType,
  DataManagementUpdateResponseType,
} from "@/types/ml/dataManagement.type";

export const getDataManagementSummaryQueryFn =
  async (): Promise<DataManagementSummaryType> => {
    const response = await getDataManagementSummaryHandlers();

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch data management summary",
      );
    }

    return response.data;
  };

export const getDataManagementStocksQueryFn =
  async (): Promise<DataManagementStocksType> => {
    const response = await getDataManagementStocksHandlers();

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch data management stocks",
      );
    }

    return response.data;
  };

export const updateStockDataQueryFn = async (
  symbol: string,
): Promise<DataManagementUpdateResponseType> => {
  const response = await updateStockDataHandlers(symbol);

  if (!response.success) {
    throw new Error(response.message || "Failed to update stock data");
  }

  return response.data;
};

export const updateAllDataQueryFn =
  async (): Promise<DataManagementUpdateAllResponseType> => {
    const response = await updateAllDataHandlers();

    if (!response.success) {
      throw new Error(response.message || "Failed to update all stock data");
    }

    return response.data;
  };
