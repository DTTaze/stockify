import { cn } from "@/utils";

interface ModelStatsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  models: any[];
  isSummaryLoading: boolean;
}

export function ModelStats(props: ModelStatsProps) {
  const { models, isSummaryLoading } = props;

  return (
    <div className={cn("grid grid-cols-1 gap-6", "md:grid-cols-4")}>
      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-6",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-2", "text-sm text-gray-600")}>Tổng Models</div>
        <div className={cn("text-3xl", "text-brand-900")}>
          {isSummaryLoading ? (
            <div
              className={cn("h-9 w-16", "animate-pulse", "rounded bg-gray-200")}
            />
          ) : (
            models.length
          )}
        </div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-6",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-2", "text-sm text-gray-600")}>Đang chạy</div>
        <div className={cn("text-3xl", "text-green-600")}>
          {isSummaryLoading ? (
            <div
              className={cn("h-9 w-16", "animate-pulse", "rounded bg-gray-200")}
            />
          ) : (
            models.filter((m) => m.status === "running").length
          )}
        </div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-6",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-2", "text-sm text-gray-600")}>Đang train</div>
        <div className={cn("text-3xl", "text-blue-600")}>
          {isSummaryLoading ? (
            <div
              className={cn("h-9 w-16", "animate-pulse", "rounded bg-gray-200")}
            />
          ) : (
            models.filter((m) => m.status === "training").length
          )}
        </div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-6",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-2", "text-sm text-gray-600")}>
          Độ chính xác TB
        </div>
        <div className={cn("text-3xl", "text-brand-900")}>
          {isSummaryLoading ? (
            <div
              className={cn("h-9 w-24", "animate-pulse", "rounded bg-gray-200")}
            />
          ) : models.length > 0 ? (
            (
              models.reduce((sum, m) => sum + (m.metrics?.accuracy || 0), 0) /
              models.length
            ).toFixed(1) + "%"
          ) : (
            "0.0%"
          )}
        </div>
      </div>
    </div>
  );
}
