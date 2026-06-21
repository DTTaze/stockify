"use client";

import { Activity, Cpu, Users } from "lucide-react";

import { AdminDashboardRealtimeType } from "@/types/admin/admin.type";

interface DashboardHeaderProps {
  realtimeData: AdminDashboardRealtimeType | null;
  realtimeError: string | null;
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const { realtimeData } = props;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-brand-900 text-3xl">Dashboard</h1>

        <p className="mt-1 text-gray-600">Tổng quan hệ thống</p>
      </div>

      <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <Activity className="h-4 w-4 animate-pulse text-green-500" />

          <span className="text-sm text-gray-600">System Online</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-xs tracking-wide text-gray-500 uppercase">
            Realtime
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-gray-700">
            <Users className="text-brand-900 h-4 w-4" />

            <span>
              {realtimeData?.activeUsers?.toLocaleString() ?? "--"} active
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3 text-sm text-gray-700">
            <Cpu className="text-brand-900 h-4 w-4" />

            <span>{realtimeData?.cpuLoad ?? "--"}% CPU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
