"use client";

export function HeaderSkeleton() {
  return (
    <>
      <header className="border-brand-700 bg-brand-900 border-b text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 animate-pulse items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-white/20" />

              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-white/20" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>

            <div className="hidden items-center space-x-6 md:flex">
              <div className="h-10 w-10 rounded-lg bg-white/10" />
              <div className="h-10 w-36 rounded-lg bg-white/10" />
              <div className="h-10 w-28 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex animate-pulse space-x-3 py-3">
            <div className="h-10 w-32 rounded bg-gray-200" />
            <div className="h-10 w-32 rounded bg-gray-200" />
            <div className="h-10 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </nav>
    </>
  );
}
