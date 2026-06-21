import React from "react";

export function TickerSkeleton() {
  return (
    <div className="flex h-12 w-full items-center justify-around border-b border-gray-200 bg-gray-100 px-6 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex animate-pulse items-center space-x-2">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
