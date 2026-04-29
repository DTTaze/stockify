import { AxiosResponse } from "axios";

import { ApiResponse } from "@/types/api";
import {
  MarketListItem,
  WatchlistItemRaw,
  WatchlistMutationResponse,
} from "@/types/watchlist/watchlist.type";

import axiosClient from "..";

export const watchlistServices = {
  getWatchlist: (): Promise<AxiosResponse<ApiResponse<WatchlistItemRaw[]>>> =>
    axiosClient.get("watchlist"),

  addToWatchlist: (symbol: string): Promise<AxiosResponse<WatchlistMutationResponse>> =>
    axiosClient.post("watchlist", { symbol }),

  removeFromWatchlist: (symbol: string): Promise<AxiosResponse<WatchlistMutationResponse>> =>
    axiosClient.delete(`watchlist/${symbol}`),

  getMarketList: (type: string): Promise<AxiosResponse<ApiResponse<MarketListItem[]>>> =>
    axiosClient.get(`ml/market/list`, { params: { type } }),
};
