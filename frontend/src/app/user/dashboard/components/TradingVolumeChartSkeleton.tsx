export function TradingVolumeChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-6 w-48 rounded-md bg-gray-200" />

      <div className="flex h-37.5 items-end gap-2">
        <div className="h-[35%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[60%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[45%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[80%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[55%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[70%] flex-1 rounded-t bg-gray-200" />
        <div className="h-[50%] flex-1 rounded-t bg-gray-200" />
      </div>
    </div>
  );
}
