import { Activity, Cpu, HardDrive, Zap } from "lucide-react";

export function MonitoringStats() {
  return (
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
  );
}
