export default function ModelListSekeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-32 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-8 w-24 rounded-full bg-gray-200" />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-8 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
            </div>
            <div className="h-10 w-24 rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
