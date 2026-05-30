import { AxiosResponse } from "axios";

import axiosClient from "..";

const BASE_URL = "/model-management";

export const modelManagementServices = {
  getSummary: (): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/summary`),

  getModels: (): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/models`),

  getModelDetail: (id: string): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/models/${id}`),

  deployModel: (id: string): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/deploy/${id}`),

  rollbackModel: (id: string): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/rollback/${id}`),

  restartModel: (id: string): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/restart/${id}`),

  deleteModel: (id: string): Promise<AxiosResponse> =>
    axiosClient.delete(`${BASE_URL}/${id}`),

  getModelVersions: (id: string): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/${id}/versions`),

  trainModel: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.post(`${BASE_URL}/train/${symbol}`),
};
