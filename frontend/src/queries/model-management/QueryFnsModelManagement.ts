import {
  deleteModelHandlers,
  deployModelHandlers,
  getModelDetailHandlers,
  getModelsHandlers,
  getModelSummaryHandlers,
  getModelVersionsHandlers,
  restartModelHandlers,
  rollbackModelHandlers,
  trainModelHandlers,
} from "@/services/model-management/modelManagementHandlers";

export const getModelSummaryQueryFn = async () => {
  const response = await getModelSummaryHandlers();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const getModelsQueryFn = async () => {
  const response = await getModelsHandlers();

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const getModelDetailQueryFn = async (id: string) => {
  const response = await getModelDetailHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const deployModelMutationFn = async (id: string) => {
  const response = await deployModelHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const rollbackModelMutationFn = async (id: string) => {
  const response = await rollbackModelHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const restartModelMutationFn = async (id: string) => {
  const response = await restartModelHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const deleteModelMutationFn = async (id: string) => {
  const response = await deleteModelHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const getModelVersionsQueryFn = async (id: string) => {
  const response = await getModelVersionsHandlers(id);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const trainModelMutationFn = async (symbol: string) => {
  const response = await trainModelHandlers(symbol);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};
