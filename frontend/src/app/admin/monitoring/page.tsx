"use client";

import { Activity } from "lucide-react";
import { useState } from "react";

import { MonitoringChart } from "./components/MonitoringChart";
import { MonitoringLogs } from "./components/MonitoringLogs";
import { MonitoringStats } from "./components/MonitoringStats";

export default function SystemMonitoring() {
  const [selectedMetric, setSelectedMetric] = useState<
    "cpu" | "memory" | "requests"
  >("cpu");

  // Mock monitoring data
  const cpuData = [
    { time: "10:00", value: 45 },
    { time: "10:05", value: 52 },
    { time: "10:10", value: 48 },
    { time: "10:15", value: 65 },
    { time: "10:20", value: 58 },
    { time: "10:25", value: 62 },
  ];

  const memoryData = [
    { time: "10:00", value: 2.3 },
    { time: "10:05", value: 2.5 },
    { time: "10:10", value: 2.4 },
    { time: "10:15", value: 2.8 },
    { time: "10:20", value: 2.6 },
    { time: "10:25", value: 2.7 },
  ];

  const requestsData = [
    { time: "10:00", value: 120 },
    { time: "10:05", value: 145 },
    { time: "10:10", value: 132 },
    { time: "10:15", value: 178 },
    { time: "10:20", value: 156 },
    { time: "10:25", value: 168 },
  ];

  const getChartData = () => {
    switch (selectedMetric) {
      case "cpu":
        return cpuData;
      case "memory":
        return memoryData;
      case "requests":
        return requestsData;
    }
  };

  const logs = [
    {
      time: "10:25:43",
      level: "info",
      message: "Model prediction completed successfully",
    },
    {
      time: "10:24:12",
      level: "warning",
      message: "High memory usage detected: 85%",
    },
    {
      time: "10:22:55",
      level: "info",
      message: "Data sync completed for 50 stocks",
    },
    {
      time: "10:20:31",
      level: "error",
      message: "Failed to fetch data for VNM: Connection timeout",
    },
    {
      time: "10:18:22",
      level: "info",
      message: "User login: nguyenvana@example.com",
    },
    {
      time: "10:15:44",
      level: "warning",
      message: "API rate limit approaching threshold",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl">Theo dõi Hệ thống</h1>
          <p className="mt-1 text-gray-600">Giám sát hiệu suất và logs</p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <Activity className="h-4 w-4 animate-pulse text-green-500" />
          <span className="text-sm text-gray-600">System Online</span>
        </div>
      </div>

      {/* System Stats */}
      <MonitoringStats />

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
