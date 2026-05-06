"use client";

import { useState } from "react";

import { DataManagementActions } from "@/app/admin/data/components/DataManagementActions";
import { DataManagementError } from "@/app/admin/data/components/DataManagementError";
import { DataManagementHeader } from "@/app/admin/data/components/DataManagementHeader";
import { DataManagementStats } from "@/app/admin/data/components/DataManagementStats";
import { DataManagementTable } from "@/app/admin/data/components/DataManagementTable";
import { EMPTY_TEMPLATE_STRING } from "@/constants/common";
import {
  useQueryDataManagementStocks,
  useQueryDataManagementSummary,
  useUpdateDataManagementAll,
  useUpdateDataManagementSymbol,
} from "@/queries/data-management/QueryHooksDataManagement";
import { cn } from "@/utils";

export default function DataManagement() {
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  const summaryQuery = useQueryDataManagementSummary();
  const stocksQuery = useQueryDataManagementStocks();

  const updateSymbolMutation = useUpdateDataManagementSymbol();
  const updateAllMutation = useUpdateDataManagementAll();

  const summary = summaryQuery.data;
  const stocks = stocksQuery.data?.stocks ?? [];

  const hasError = summaryQuery.isError || stocksQuery.isError;

  const isBusy =
    summaryQuery.isLoading ||
    stocksQuery.isLoading ||
    updateAllMutation.status === "pending" ||
    updateSymbolMutation.status === "pending";

  const handleUpdateStock = async (symbol: string) => {
    setUpdatingStock(symbol);

    try {
      await updateSymbolMutation.mutateAsync(symbol);
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleUpdateAll = async () => {
    setUpdatingStock("all");

    try {
      await updateAllMutation.mutateAsync();
    } finally {
      setUpdatingStock(null);
    }
  };

  return (
    <div className={cn("p-6", "space-y-6")}>
      <div
        className={cn(
          "flex flex-col gap-4",
          "md:flex-row md:items-center md:justify-between",
        )}
      >
        <DataManagementHeader />

        <DataManagementActions
          isBusy={isBusy}
          updatingStock={updatingStock}
          onUpdateAll={handleUpdateAll}
        />
      </div>

      {hasError && <DataManagementError />}

      <DataManagementStats
        totalStocks={summary?.total_stocks ?? EMPTY_TEMPLATE_STRING}
        updated={summary?.updated ?? EMPTY_TEMPLATE_STRING}
        needsUpdate={summary?.needs_update ?? EMPTY_TEMPLATE_STRING}
        totalRecords={
          summary?.total_records?.toLocaleString() ?? EMPTY_TEMPLATE_STRING
        }
      />

      <DataManagementTable
        stocks={stocks}
        isLoading={summaryQuery.isLoading || stocksQuery.isLoading}
        isBusy={isBusy}
        updatingStock={updatingStock}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
}
