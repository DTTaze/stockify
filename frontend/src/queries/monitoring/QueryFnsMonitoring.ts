import { monitoringServices } from "@/services/monitoring";

export interface MonitoringHistoryItem {
  time: string;
  value: number;
}

export interface MonitoringData {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  requests: number;
  uptime: string;
  history: {
    cpu: MonitoringHistoryItem[];
    memory: MonitoringHistoryItem[];
    requests: MonitoringHistoryItem[];
  };
  logs: {
    time: string;
    level: string;
    message: string;
  }[];
}

export const getMonitoringQueryFn = async (): Promise<MonitoringData> => {
  const response = await monitoringServices.getMonitoring();
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
