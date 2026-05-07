import {
  getAdminDashboardActivitiesHandlers,
  getAdminDashboardPerformanceHandlers,
  getAdminDashboardSummaryHandlers,
} from "@/services/admin/adminHandlers";

export const getAdminDashboardSummaryQueryFn = async () => {
  const response = await getAdminDashboardSummaryHandlers();

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const getAdminDashboardPerformanceQueryFn = async () => {
  const response = await getAdminDashboardPerformanceHandlers();

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const getAdminDashboardActivitiesQueryFn = async () => {
  const response = await getAdminDashboardActivitiesHandlers();

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};
