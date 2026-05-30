import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteModelMutationFn,
  deployModelMutationFn,
  getModelDetailQueryFn,
  getModelsQueryFn,
  getModelSummaryQueryFn,
  getModelVersionsQueryFn,
  restartModelMutationFn,
  rollbackModelMutationFn,
  trainModelMutationFn,
} from "./QueryFnsModelManagement";
import { QueryKeysModelManagement } from "./QueryKeysModelManagement";

export const useGetModelSummary = () => {
  return useQuery({
    queryKey: [QueryKeysModelManagement.ROOT, QueryKeysModelManagement.SUMMARY],
    queryFn: getModelSummaryQueryFn,
  });
};

export const useGetModels = () => {
  return useQuery({
    queryKey: [QueryKeysModelManagement.ROOT, QueryKeysModelManagement.MODELS],
    queryFn: getModelsQueryFn,
    refetchOnMount: true,
  });
};

export const useGetModelDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [
      QueryKeysModelManagement.ROOT,
      QueryKeysModelManagement.DETAIL,
      id,
    ],
    queryFn: () => getModelDetailQueryFn(id),
    enabled: options?.enabled,
    refetchOnMount: true,
  });
};

export const useDeployModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deployModelMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.MODELS,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.SUMMARY,
        ],
      });
    },
  });
};

export const useRollbackModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rollbackModelMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.MODELS,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.SUMMARY,
        ],
      });
    },
  });
};

export const useRestartModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restartModelMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.MODELS,
        ],
      });
    },
  });
};

export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModelMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.MODELS,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.SUMMARY,
        ],
      });
    },
  });
};

interface UseGetModelVersionsOptions {
  id: string;
  enabled?: boolean;
}

export const useGetModelVersions = (options: UseGetModelVersionsOptions) => {
  const { id, enabled } = options;

  return useQuery({
    queryKey: [
      QueryKeysModelManagement.ROOT,
      QueryKeysModelManagement.VERSIONS,
      id,
    ],
    queryFn: () => getModelVersionsQueryFn(id),
    enabled: enabled,
    refetchOnMount: true,
  });
};

export const useTrainModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainModelMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.MODELS,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeysModelManagement.ROOT,
          QueryKeysModelManagement.SUMMARY,
        ],
      });
    },
  });
};
