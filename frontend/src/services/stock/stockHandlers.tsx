import { ApiResponse } from "@/types/api";
import { stockServices } from ".";

export const getIndexQuoteHandlers = async (
  indexCode: string,
): Promise<ApiResponse<StockDataType>> => {
  const response = await stockServices.getIndexQuote(indexCode);

  return response.data;
};
