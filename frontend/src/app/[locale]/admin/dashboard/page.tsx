"use client";

import { getCookie } from "cookies-next/client";
import { Cpu, Database, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
import { STATIC_API_URL } from "@/constants/common";
import {
  useGetAdminDashboardActivities,
  useGetAdminDashboardPerformance,
  useGetAdminDashboardSummary,
} from "@/queries/admin/QueryHooksAdmin";
import { AdminDashboardRealtimeType } from "@/types/admin/admin.type";

import { DashboardHeader } from "./components/DashboardHeader";
import { PerformanceChart } from "./components/PerformanceChart";
import { RecentActivities } from "./components/RecentActivities";
import { StatsCards } from "./components/StatsCards";

export default function AdminDashboard() {
  const summaryQuery = useGetAdminDashboardSummary();
  const performanceQuery = useGetAdminDashboardPerformance();
  const activitiesQuery = useGetAdminDashboardActivities();

  const [realtimeData, setRealtimeData] =
    useState<AdminDashboardRealtimeType | null>(null);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = getCookie(ACCESS_TOKEN) as string | undefined;
    const baseUrl = STATIC_API_URL?.replace(/\/$/, "") ?? "";
    const eventSource = new EventSource(
      token
        ? `${baseUrl}/admin/dashboard/realtime?token=${encodeURIComponent(token)}`
        : `${baseUrl}/admin/dashboard/realtime`,
    );

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          data: AdminDashboardRealtimeType;
        };
        if (payload?.data) {
          setRealtimeData(payload.data);
          setRealtimeError(null);
        }
      } catch {
        setRealtimeError("Không thể đọc dữ liệu realtime");
      }
    };

    eventSource.onerror = () => {
      setRealtimeError("Kết nối realtime bị mất");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const isLoading =
    summaryQuery.isLoading ||
    performanceQuery.isLoading ||
    activitiesQuery.isLoading;

  const hasError =
    summaryQuery.isError || performanceQuery.isError || activitiesQuery.isError;

  const summary = summaryQuery.data;
  const performanceData = performanceQuery.data ?? [];
  const activities = activitiesQuery.data ?? [];

  const stats = useMemo(
    () => [
      {
        label: "Tổng User",
        value: summary?.total_users?.toLocaleString() ?? "--",
        change: summary
          ? `${summary.active_users?.toLocaleString() ?? 0} hoạt động`
          : "--",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Cổ phiếu đã xử lý",
        value: summary?.updated_stocks?.toLocaleString() ?? "--",
        change: summary
          ? `Tổng: ${summary.total_stocks?.toLocaleString() ?? 0}`
          : "--",
        icon: Database,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "Models đang chạy",
        value: summary?.active_models?.toLocaleString() ?? "--",
        change: summary
          ? `Lỗi: ${summary.failed_models?.toLocaleString() ?? 0}`
          : "--",
        icon: Cpu,
        color: "from-purple-500 to-purple-600",
        bgColor:
          summary?.failed_models && summary.failed_models > 0
            ? "bg-red-50 dark:bg-red-950/30"
            : "bg-purple-50 dark:bg-purple-950/30",
        textColor:
          summary?.failed_models && summary.failed_models > 0
            ? "text-red-600 dark:text-red-400"
            : "text-purple-600 dark:text-purple-400",
      },
      {
        label: "Tổng bản ghi",
        value: summary?.total_records?.toLocaleString() ?? "--",
        change: summary
          ? `Chưa đồng bộ: ${summary.needs_update_stocks?.toLocaleString() ?? 0}`
          : "--",
        icon: TrendingUp,
        color: "from-orange-500 to-orange-600",
        bgColor:
          summary?.needs_update_stocks && summary.needs_update_stocks > 0
            ? "bg-yellow-50 dark:bg-yellow-950/30"
            : "bg-orange-50 dark:bg-orange-950/30",
        textColor:
          summary?.needs_update_stocks && summary.needs_update_stocks > 0
            ? "text-yellow-700 dark:text-yellow-400"
            : "text-orange-600 dark:text-orange-400",
      },
    ],
    [summary],
  );

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        realtimeData={realtimeData}
        realtimeError={realtimeError}
      />

      {hasError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Có lỗi khi tải dữ liệu dashboard. Vui lòng thử lại sau.
        </div>
      )}

      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <PerformanceChart
          performanceData={performanceData}
          isLoading={isLoading}
        />

        <RecentActivities
          activities={activities}
          isLoading={isLoading}
          realtimeError={realtimeError}
        />
      </div>
    </div>
  );
}
