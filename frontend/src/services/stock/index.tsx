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

  getStocks: (params?: {
    group?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse> => axiosClient.get(`stocks`, { params }),

  syncClassifications: (): Promise<AxiosResponse> =>
    axiosClient.post(`stocks/sync-categories`),

  getClassificationSummary: (): Promise<AxiosResponse> =>
    axiosClient.get(`stocks/classification-summary`),

  getPrediction: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.get(`ml/prediction/${symbol}`),

  getSupportedSymbols: (): Promise<AxiosResponse> =>
    axiosClient.get(`ml/prediction/symbols`),
};
