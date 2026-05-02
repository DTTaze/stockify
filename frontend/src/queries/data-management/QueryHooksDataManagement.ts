import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getDataManagementStocksQueryFn,
  getDataManagementSummaryQueryFn,
  updateAllDataQueryFn,
  updateStockDataQueryFn,
} from "./QueryFnsDataManagement";
import { QueryKeysDataManagement } from "./QueryKeysDataManagement";

export const useQueryDataManagementSummary = () =>
  useQuery({
    queryKey: [QueryKeysDataManagement.ROOT, QueryKeysDataManagement.SUMMARY],
    queryFn: getDataManagementSummaryQueryFn,
    refetchOnMount: true,
  });

export const useQueryDataManagementStocks = () =>
  useQuery({
    queryKey: [QueryKeysDataManagement.ROOT, QueryKeysDataManagement.STOCKS],
    queryFn: getDataManagementStocksQueryFn,
    refetchOnMount: true,
  });

export const useUpdateDataManagementSymbol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockDataQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysDataManagement.ROOT,
          QueryKeysDataManagement.SUMMARY,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysDataManagement.ROOT,
          QueryKeysDataManagement.STOCKS,
        ],
      });
    },
  });
};

export const useUpdateDataManagementAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAllDataQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysDataManagement.ROOT,
          QueryKeysDataManagement.SUMMARY,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysDataManagement.ROOT,
          QueryKeysDataManagement.STOCKS,
        ],
      });
    },
  });
};
