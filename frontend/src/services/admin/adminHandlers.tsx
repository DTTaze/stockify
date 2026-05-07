import {
  AdminDashboardActivityTypeItem,
  AdminDashboardPerformanceType,
  AdminDashboardRealtimeType,
  AdminDashboardSummaryType,
} from "@/types/admin/admin.type";
import { ApiResponse } from "@/types/api";

import { adminServices } from ".";

export const getAdminDashboardSummaryHandlers = async (): Promise<
  ApiResponse<AdminDashboardSummaryType>
> => {
  const response = await adminServices.getDashboardSummary();
  return response.data;
};

export const getAdminDashboardPerformanceHandlers = async (): Promise<
  ApiResponse<AdminDashboardPerformanceType[]>
> => {
  const response = await adminServices.getDashboardPerformance();
  return response.data;
};

export const getAdminDashboardActivitiesHandlers = async (): Promise<
  ApiResponse<AdminDashboardActivityTypeItem[]>
> => {
  const response = await adminServices.getDashboardActivities();
  return response.data;
};

export const getAdminDashboardRealtimeHandlers = async (): Promise<
  ApiResponse<AdminDashboardRealtimeType>
> => {
  const response = await adminServices.getDashboardRealtime();
  return response.data;
};
