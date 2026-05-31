import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminDashboardActivitiesQueryFn,
  getAdminDashboardPerformanceQueryFn,
  getAdminDashboardSummaryQueryFn,
  syncAdminStockPricesQueryFn,
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

export const useSyncAdminStockPrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncAdminStockPricesQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.PERFORMANCE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysAdmin.ROOT, QueryKeysAdmin.ACTIVITIES],
      });
    },
  });
};
