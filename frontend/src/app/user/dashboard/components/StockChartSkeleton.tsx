export function StockChartSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 rounded-md bg-gray-200" />
      </div>

      <div className="h-87.5 w-full rounded-xl border border-gray-200 bg-gray-100 p-4">
        <div className="flex h-full items-end gap-2">
          <div className="h-[30%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[55%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[40%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[70%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[50%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[85%] flex-1 rounded-t bg-gray-300" />
          <div className="h-[60%] flex-1 rounded-t bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
