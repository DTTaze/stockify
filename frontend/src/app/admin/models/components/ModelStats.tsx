interface ModelStatsProps {
  models: any[];
  isSummaryLoading: boolean;
}

export function ModelStats(props: ModelStatsProps) {
  const { models, isSummaryLoading } = props;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Tổng Models</div>
        <div className="text-3xl text-[#1a365d]">
          {isSummaryLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            models.length
          )}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Đang chạy</div>
        <div className="text-3xl text-green-600">
          {isSummaryLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            models.filter((m) => m.status === "running").length
          )}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Đang train</div>
        <div className="text-3xl text-blue-600">
          {isSummaryLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            models.filter((m) => m.status === "training").length
          )}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Độ chính xác TB</div>
        <div className="text-3xl text-[#d4af37]">
          {isSummaryLoading ? (
            <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
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
