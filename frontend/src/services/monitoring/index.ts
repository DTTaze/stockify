import { AxiosResponse } from "axios";

import axiosClient from "..";

const BASE_URL = "/health";

export const monitoringServices = {
  getMonitoring: (): Promise<AxiosResponse> =>
    axiosClient.get(`${BASE_URL}/monitoring`),
};
