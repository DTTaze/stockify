import { AlertTriangle, Info } from "lucide-react";

interface LogItem {
  time: string;
  level: string;
  message: string;
}

interface MonitoringLogsProps {
  logs: LogItem[];
}

export function MonitoringLogs({ logs }: MonitoringLogsProps) {
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-brand-900 mb-6 text-2xl">System Logs</h2>
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={`${log.time}-${log.message}`}
            className={`flex items-start space-x-3 rounded-xl border-2 p-4 transition-all hover:shadow-sm ${getLogColor(
              log.level,
            )}`}
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
  );
}
