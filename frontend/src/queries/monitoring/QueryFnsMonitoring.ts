import { monitoringServices } from "@/services/monitoring";

export const getMonitoringQueryFn = async (): Promise<any> => {
  const response = await monitoringServices.getMonitoring();
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
