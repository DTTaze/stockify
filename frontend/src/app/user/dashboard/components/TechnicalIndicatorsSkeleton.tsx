export function TechnicalIndicatorsSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-52 rounded bg-gray-200" />
        <div className="h-5 w-5 rounded bg-gray-200" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border-2 border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />

                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <div className="ml-auto h-5 w-16 rounded bg-gray-200" />
                <div className="ml-auto h-6 w-14 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border bg-gray-50 p-4">
        <div className="mb-2 h-4 w-48 rounded bg-gray-200" />
        <div className="h-3 w-56 rounded bg-gray-100" />
      </div>
    </div>
  );
}
