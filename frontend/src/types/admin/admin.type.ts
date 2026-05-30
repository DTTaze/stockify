import { AlertCircle, CheckCircle } from "lucide-react";

export enum ADMIN_DASHBOARD_ACTIVITY_TYPE {
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
}
export const ACTIVITY_CONFIG: Record<
  ADMIN_DASHBOARD_ACTIVITY_TYPE,
  {
    container: string;
    iconBg: string;
    icon: typeof AlertCircle;
  }
> = {
  [ADMIN_DASHBOARD_ACTIVITY_TYPE.SUCCESS]: {
    container: "border-green-100 bg-green-50",
    iconBg: "bg-green-500",
    icon: CheckCircle,
  },

  [ADMIN_DASHBOARD_ACTIVITY_TYPE.WARNING]: {
    container: "border-yellow-100 bg-yellow-50",
    iconBg: "bg-yellow-500",
    icon: AlertCircle,
  },

  [ADMIN_DASHBOARD_ACTIVITY_TYPE.INFO]: {
    container: "border-blue-100 bg-blue-50",
    iconBg: "bg-blue-500",
    icon: AlertCircle,
  },
};

export interface AdminDashboardSummaryType {
  total_users: number;
  active_users: number;
  total_models: number;
  active_models: number;
  failed_models: number;
  total_stocks: number;
  updated_stocks: number;
  needs_update_stocks: number;
  total_records: number;
}

export interface AdminDashboardPerformanceType {
  time: string;
  requests: number;
  accuracy: number;
  load: number;
}

export interface AdminDashboardActivityTypeItem {
  type: ADMIN_DASHBOARD_ACTIVITY_TYPE;
  message: string;
  timestamp: string;
}

export interface AdminDashboardRealtimeType {
  cpuLoad: number;
  memoryUsage: number;
  activeUsers: number;
  timestamp: string;
}
