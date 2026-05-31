"use client";

import { Activity } from "lucide-react";
import { useState } from "react";

import { useGetMonitoring } from "@/queries/monitoring/QueryHooksMonitoring";

import { MonitoringChart } from "./components/MonitoringChart";
import { MonitoringLogs } from "./components/MonitoringLogs";
import { MonitoringStats } from "./components/MonitoringStats";

export default function SystemMonitoring() {
  const { data, isLoading } = useGetMonitoring();
  const [selectedMetric, setSelectedMetric] = useState<
    "cpu" | "memory" | "requests"
  >("cpu");

  const getChartData = () => {
    if (!data?.history) {
      return [];
    }
    return data.history[selectedMetric] || [];
  };

  const logs = data?.logs || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl">Theo dõi Hệ thống</h1>
          <p className="mt-1 text-gray-600">Giám sát hiệu suất và logs</p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <Activity
            className={`h-4 w-4 ${
              isLoading
                ? "animate-spin text-yellow-500"
                : "animate-pulse text-green-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {isLoading ? "Connecting..." : "System Online"}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <MonitoringStats stats={data} isLoading={isLoading} />

      {/* Performance Chart */}
      <MonitoringChart
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        chartData={getChartData()}
      />

      {/* System Logs */}
      <MonitoringLogs logs={logs} />
    </div>
  );
}
