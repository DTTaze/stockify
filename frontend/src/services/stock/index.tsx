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

  getMarketGroups: (): Promise<AxiosResponse> =>
    axiosClient.get(`stock-categories/market`),

  getIcbIndustries: (params?: { level?: number }): Promise<AxiosResponse> =>
    axiosClient.get(`stock-categories/icb`, { params }),

  getIcbStocks: (
    icbCode: string,
    params?: { keyword?: string; limit?: number; offset?: number },
  ): Promise<AxiosResponse> =>
    axiosClient.get(`stock-categories/icb/${icbCode}`, { params }),

  getTickerCategories: (ticker: string): Promise<AxiosResponse> =>
    axiosClient.get(`stock-categories/ticker/${ticker}`),

  syncMarketGroups: (): Promise<AxiosResponse> =>
    axiosClient.post(`stock-categories/sync-market-groups`),

  syncIcbIndustries: (): Promise<AxiosResponse> =>
    axiosClient.post(`stock-categories/sync-icb-industries`),

  syncAllCategories: (): Promise<AxiosResponse> =>
    axiosClient.post(`stock-categories/sync-all`),
};
