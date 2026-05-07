"use client";

import { Cpu, Database, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardHeader } from "@/app/admin/dashboard/components/DashboardHeader";
import { PerformanceChart } from "@/app/admin/dashboard/components/PerformanceChart";
import { RecentActivities } from "@/app/admin/dashboard/components/RecentActivities";
import { StatsCards } from "@/app/admin/dashboard/components/StatsCards";
import { STATIC_API_URL } from "@/constants/common";
import {
  useGetAdminDashboardActivities,
  useGetAdminDashboardPerformance,
  useGetAdminDashboardSummary,
} from "@/queries/admin/QueryHooksAdmin";
import { AdminDashboardRealtimeType } from "@/types/admin/admin.type";

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

    const baseUrl = STATIC_API_URL?.replace(/\/$/, "") ?? "";
    const eventSource = new EventSource(`${baseUrl}/admin/dashboard/realtime`);

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
        change: "+12%",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        label: "Cổ phiếu đã xử lý",
        value: summary?.updated_stocks?.toLocaleString() ?? "--",
        change: "+5%",
        icon: Database,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        label: "Models đang chạy",
        value: summary?.active_models?.toLocaleString() ?? "--",
        change: "0",
        icon: Cpu,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        label: "Tổng bản ghi",
        value: summary?.total_records?.toLocaleString() ?? "--",
        change: "+23%",
        icon: TrendingUp,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
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

      <StatsCards stats={stats} />

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
