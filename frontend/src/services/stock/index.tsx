import { AxiosResponse } from "axios";

import { MarketQuoteParams } from "@/types/stock/stock.type";
import axiosClient from "..";

export const stockServices = {
  getIndexQuote: (params: MarketQuoteParams): Promise<AxiosResponse> =>
    axiosClient.get(`ml/market/quote`, {
      params,
    }),

  getQuoteHistorical: (params: MarketQuoteParams): Promise<AxiosResponse> =>
    axiosClient.get(`ml/market/history`, {
      params,
    }),

  getStockCompanies: (): Promise<AxiosResponse> =>
    axiosClient.get(`stock-companies`),
};
