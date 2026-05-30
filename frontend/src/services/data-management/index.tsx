import { AxiosResponse } from "axios";

import axiosClient from "..";

const BASE_URL = "/data-management";

export const dataManagementServices = {
  getSummary: (): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/summary`),

  getStocks: (params?: {
    keyword?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/stocks`, { params }),

  updateStock: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/update/${symbol}`),

  updateAll: (): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/update-all`),
};
