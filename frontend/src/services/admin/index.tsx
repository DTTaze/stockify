import { AxiosResponse } from "axios";

import {
  AdminDashboardActivityTypeItem,
  AdminDashboardPerformanceType,
  AdminDashboardRealtimeType,
  AdminDashboardSummaryType,
  AdminStockPriceSyncResponseType,
} from "@/types/admin/admin.type";
import { ApiResponse } from "@/types/api";

import axiosClient from "..";

export const adminServices = {
  getDashboardSummary: (): Promise<
    AxiosResponse<ApiResponse<AdminDashboardSummaryType>>
  > => axiosClient.get("admin/dashboard/summary"),
  getDashboardPerformance: (): Promise<
    AxiosResponse<ApiResponse<AdminDashboardPerformanceType[]>>
  > => axiosClient.get("admin/dashboard/performance"),
  getDashboardActivities: (): Promise<
    AxiosResponse<ApiResponse<AdminDashboardActivityTypeItem[]>>
  > => axiosClient.get("admin/dashboard/activities"),
  getDashboardRealtime: (): Promise<
    AxiosResponse<ApiResponse<AdminDashboardRealtimeType>>
  > => axiosClient.get("admin/dashboard/realtime"),
  syncStockPrices: (): Promise<
    AxiosResponse<ApiResponse<AdminStockPriceSyncResponseType>>
  > => axiosClient.post("admin/stocks/sync-prices"),
};
