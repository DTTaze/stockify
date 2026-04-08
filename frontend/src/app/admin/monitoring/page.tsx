"use client";

import { useState } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-md">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">CPU</span>
          </div>
          <div className="text-brand-900 mb-1 text-3xl">58%</div>
          <div className="text-sm text-gray-500">Utilization</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600"
              style={{ width: "58%" }}
            ></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-xl bg-linear-to-br from-green-500 to-green-600 p-3 shadow-md">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Memory</span>
          </div>
          <div className="text-brand-900 mb-1 text-3xl">2.7 GB</div>
          <div className="text-sm text-gray-500">Used / 8 GB</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-linear-to-r from-green-500 to-green-600"
              style={{ width: "34%" }}
            ></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-xl bg-linear-to-br from-purple-500 to-purple-600 p-3 shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Requests</span>
          </div>
          <div className="text-brand-900 mb-1 text-3xl">168</div>
          <div className="text-sm text-gray-500">per minute</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-xl bg-linear-to-br from-orange-500 to-orange-600 p-3 shadow-md">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Uptime</span>
          </div>
          <div className="text-brand-900 mb-1 text-3xl">99.9%</div>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-brand-900 text-2xl">Performance Metrics</h2>
            <p className="mt-1 text-sm text-gray-600">Real-time monitoring</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric("cpu")}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                selectedMetric === "cpu"
                  ? "bg-brand-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              CPU
            </button>
            <button
              onClick={() => setSelectedMetric("memory")}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                selectedMetric === "memory"
                  ? "bg-brand-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Memory
            </button>
            <button
              onClick={() => setSelectedMetric("requests")}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                selectedMetric === "requests"
                  ? "bg-brand-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Requests
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData()}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-neutral-200)"
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "var(--color-neutral-500)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid var(--color-neutral-200)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                selectedMetric === "cpu"
                  ? "var(--color-brand-900)"
                  : selectedMetric === "memory"
                    ? "#10b981"
                    : "#8b5cf6"
              }
              strokeWidth={3}
              dot={{
                fill:
                  selectedMetric === "cpu"
                    ? "var(--color-brand-900)"
                    : selectedMetric === "memory"
                      ? "#10b981"
                      : "#8b5cf6",
                r: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Logs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-brand-900 mb-6 text-2xl">System Logs</h2>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 rounded-xl border-2 p-4 transition-all hover:shadow-sm ${getLogColor(log.level)}`}
            >
              {getLogIcon(log.level)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-brand-900 text-sm">{log.message}</span>
                  <span className="ml-4 text-xs text-gray-500">{log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
