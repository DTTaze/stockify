import { AxiosResponse } from "axios";

import axiosClient from "..";

export const stockServices = {
  getIndexQuote: (indexCode?: string): Promise<AxiosResponse> =>
    axiosClient.get(`ml/indices/${indexCode}/quote`),
};
