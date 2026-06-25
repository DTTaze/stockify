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
        <h1 className="text-brand-900 text-3xl font-semibold dark:text-neutral-50">
          Dashboard
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">Tổng quan hệ thống</p>
      </div>

      <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
        <div className="border-border bg-card text-card-foreground flex items-center gap-2 rounded-xl border px-4 py-2 shadow-sm">
          <Activity className="text-success-500 h-4 w-4 animate-pulse" />

          <span className="text-muted-foreground text-sm">System Online</span>
        </div>

        <div className="border-border bg-card text-card-foreground rounded-xl border px-4 py-3 shadow-sm">
          <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Realtime
          </div>

          <div className="text-muted-foreground mt-2 flex items-center gap-3 text-sm">
            <Users className="text-brand-900 h-4 w-4 dark:text-neutral-300" />

            <span className="text-foreground">
              {realtimeData?.activeUsers?.toLocaleString() ?? "--"} active
            </span>
          </div>

          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
            <Cpu className="text-brand-900 h-4 w-4 dark:text-neutral-300" />

            <span className="text-foreground">
              {realtimeData?.cpuLoad ?? "--"}% CPU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
