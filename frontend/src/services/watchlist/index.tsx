import { AxiosResponse } from "axios";

import axiosClient from "..";

export const watchlistServices = {
  getWatchlist: (): Promise<AxiosResponse> => axiosClient.get("watchlist"),

  addToWatchlist: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.post("watchlist", { symbol }),

  removeFromWatchlist: (symbol: string): Promise<AxiosResponse> =>
    axiosClient.delete(`watchlist/${symbol}`),

  getMarketList: (type: string): Promise<AxiosResponse> =>
    axiosClient.get(`ml/market/list`, { params: { type } }),
};
