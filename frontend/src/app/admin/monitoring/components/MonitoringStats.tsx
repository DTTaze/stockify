import { Activity, Cpu, HardDrive, Zap } from "lucide-react";

interface MonitoringStatsProps {
  stats?: {
    cpu: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    requests: number;
    uptime: string;
  };
  isLoading: boolean;
}

export function MonitoringStats({ stats, isLoading }: MonitoringStatsProps) {
  const cpuVal = stats?.cpu ?? 0;
  const memUsed = stats?.memory?.used ?? 0;
  const memTotal = stats?.memory?.total ?? 0;
  const memPercentage = stats?.memory?.percentage ?? 0;
  const requestsVal = stats?.requests ?? 0;
  const uptimeVal = stats?.uptime ?? "99.9%";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* CPU */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-md">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm text-gray-600">CPU</span>
        </div>
        <div className="text-brand-900 mb-1 text-3xl font-bold">
          {isLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            `${cpuVal}%`
          )}
        </div>
        <div className="text-sm text-gray-500">Utilization</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${cpuVal}%` }}
          ></div>
        </div>
      </div>

      {/* Memory */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-xl bg-linear-to-br from-green-500 to-green-600 p-3 shadow-md">
            <HardDrive className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm text-gray-600">Memory</span>
        </div>
        <div className="text-brand-900 mb-1 text-3xl font-bold">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            `${memUsed} GB`
          )}
        </div>
        <div className="text-sm text-gray-500">
          Used / {memTotal} GB ({memPercentage}%)
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
            style={{ width: `${memPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Requests */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-xl bg-linear-to-br from-purple-500 to-purple-600 p-3 shadow-md">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm text-gray-600">Requests</span>
        </div>
        <div className="text-brand-900 mb-1 text-3xl font-bold">
          {isLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            requestsVal
          )}
        </div>
        <div className="text-sm text-gray-500">per minute</div>
      </div>

      {/* Uptime */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-xl bg-linear-to-br from-orange-500 to-orange-600 p-3 shadow-md">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm text-gray-600">Uptime</span>
        </div>
        <div className="text-brand-900 mb-1 text-3xl font-bold">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-gray-200" />
          ) : (
            uptimeVal
          )}
        </div>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>
    </div>
  );
}
