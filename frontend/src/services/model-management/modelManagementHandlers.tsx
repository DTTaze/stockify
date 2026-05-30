import { ApiResponse } from "@/types/api";
import {
  ModelDetail,
  ModelItem,
  ModelSummary,
  ModelVersion,
} from "@/types/model-management";

import { modelManagementServices } from ".";

export const getModelSummaryHandlers = async (): Promise<
  ApiResponse<ModelSummary>
> => {
  const response = await modelManagementServices.getSummary();
  return response.data;
};

export const getModelsHandlers = async (): Promise<
  ApiResponse<ModelItem[]>
> => {
  const response = await modelManagementServices.getModels();
  return response.data;
};

export const getModelDetailHandlers = async (
  id: string,
): Promise<ApiResponse<ModelDetail>> => {
  const response = await modelManagementServices.getModelDetail(id);
  return response.data;
};

export const deployModelHandlers = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const response = await modelManagementServices.deployModel(id);
  return response.data;
};

export const rollbackModelHandlers = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const response = await modelManagementServices.rollbackModel(id);

  if (!response.data.success) throw new Error(response.data.message);

  return response.data;
};

export const restartModelHandlers = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const response = await modelManagementServices.restartModel(id);

  if (!response.data.success) throw new Error(response.data.message);

  return response.data;
};

export const deleteModelHandlers = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const response = await modelManagementServices.deleteModel(id);
  return response.data;
};

export const getModelVersionsHandlers = async (
  id: string,
): Promise<ApiResponse<ModelVersion[]>> => {
  const response = await modelManagementServices.getModelVersions(id);
  return response.data;
};

export const trainModelHandlers = async (
  symbol: string,
): Promise<ApiResponse<null>> => {
  const response = await modelManagementServices.trainModel(symbol);
  return response.data;
};
