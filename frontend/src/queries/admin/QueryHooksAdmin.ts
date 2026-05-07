import { useQuery } from "@tanstack/react-query";

import {
  getAdminDashboardActivitiesQueryFn,
  getAdminDashboardPerformanceQueryFn,
  getAdminDashboardSummaryQueryFn,
} from "./QueryFnsAdmin";
import { QueryKeysAdmin } from "./QueryKeysAdmin";

export const useGetAdminDashboardSummary = () => {
  return useQuery({
    queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.SUMMARY],
    queryFn: getAdminDashboardSummaryQueryFn,
    refetchInterval: 30000,
  });
};

export const useGetAdminDashboardPerformance = () => {
  return useQuery({
    queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.PERFORMANCE],
    queryFn: getAdminDashboardPerformanceQueryFn,
    refetchInterval: 30000,
  });
};

export const useGetAdminDashboardActivities = () => {
  return useQuery({
    queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.ACTIVITIES],
    queryFn: getAdminDashboardActivitiesQueryFn,
    refetchInterval: 30000,
  });
};
