import { AxiosResponse } from "axios";

import axiosClient from "..";

export const dataManagementServices = {
  getSummary: (): Promise<AxiosResponse> =>
    axiosClient.get(`ml/data-management/summary`),

  getStocks: (): Promise<AxiosResponse> =>
    axiosClient.get(`ml/data-management/stocks`),

  updateStock: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.post(`ml/data-management/update/${symbol}`),

  updateAll: (): Promise<AxiosResponse> =>
    axiosClient.post(`ml/data-management/update-all`),
};
