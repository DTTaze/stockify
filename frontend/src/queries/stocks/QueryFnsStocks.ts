import { getIndexQuoteHandlers } from "@/services/stock/stockHandlers";

export const getIndexQuoteQueryFn = async (
  indexCode: string,
): Promise<StockDataType> => {
  const response = await getIndexQuoteHandlers(indexCode);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch index quote");
  }

  return response.data;
};
