import React from "react";

import { useMarketIndices } from "./hooks/useMarketIndices";
import { TickerSkeleton } from "./skeletons/TickerSkeleton";
import { TickerItem } from "./TickerItem";

export function IndexTicker() {
  const { indices, isLoading } = useMarketIndices();

  if (isLoading) {
    return <TickerSkeleton />;
  }

  return (
    <div className="no-scrollbar border-gray-250 flex w-full items-center gap-6 overflow-x-auto border-b bg-gray-100/80 px-6 py-2.5 whitespace-nowrap shadow-inner dark:border-slate-800 dark:bg-slate-900">
      {indices.map(({ label, data }) => (
        <TickerItem key={label} label={label} data={data} />
      ))}
    </div>
  );
}
