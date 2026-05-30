import { useState } from "react";
import { toast } from "sonner";

import { EMPTY_TEMPLATE_STRING } from "@/constants/common";
import {
  useQueryDataManagementStocks,
  useQueryDataManagementSummary,
  useUpdateDataManagementAll,
  useUpdateDataManagementSymbol,
} from "@/queries/data-management/QueryHooksDataManagement";

import { DataManagementStats } from "./DataManagementStats";
import { DataManagementTable } from "./DataManagementTable";

type Props = {
  isParentBusy: boolean;
  onBusyChange: (busy: boolean) => void;
};

export function TrainingDataSection({ isParentBusy, onBusyChange }: Props) {
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const [trainingSearch, setTrainingSearch] = useState("");
  const [trainingStatus, setTrainingStatus] = useState<
    "all" | "updated" | "needs_update"
  >("all");
  const [trainingPage, setTrainingPage] = useState(1);
  const [trainingLimit, setTrainingLimit] = useState(10);

  // Queries & Mutations
  const summaryQuery = useQueryDataManagementSummary();
  const trainingOffset = (trainingPage - 1) * trainingLimit;
  const stocksQuery = useQueryDataManagementStocks({
    keyword: trainingSearch.trim() || undefined,
    status: trainingStatus,
    limit: trainingLimit,
    offset: trainingOffset,
  });
  const updateSymbolMutation = useUpdateDataManagementSymbol();
  const updateAllMutation = useUpdateDataManagementAll();

  const summary = summaryQuery.data;
  const stocks = stocksQuery.data?.stocks ?? [];
  const trainingTotal = stocksQuery.data?.total ?? 0;
  const trainingTotalPages = Math.ceil(trainingTotal / trainingLimit) || 1;

  const isBusy =
    isParentBusy ||
    summaryQuery.isLoading ||
    stocksQuery.isLoading ||
    updateAllMutation.status === "pending" ||
    updateSymbolMutation.status === "pending";

  const handleUpdateStock = async (symbol: string) => {
    setUpdatingStock(symbol);
    onBusyChange(true);
    try {
      await updateSymbolMutation.mutateAsync(symbol);
      toast.success(`Cập nhật dữ liệu cho ${symbol} thành công`);
    } catch (err: any) {
      toast.error(`Lỗi cập nhật ${symbol}: ${err.message}`);
    } finally {
      setUpdatingStock(null);
      onBusyChange(false);
    }
  };

  const handleTrainingSearchChange = (val: string) => {
    setTrainingSearch(val);
    setTrainingPage(1);
  };

  const handleTrainingStatusChange = (
    val: "all" | "updated" | "needs_update",
  ) => {
    setTrainingStatus(val);
    setTrainingPage(1);
  };

  const handleTrainingLimitChange = (newLimit: number) => {
    setTrainingLimit(newLimit);
    setTrainingPage(1);
  };

  return (
    <>
      {/* Stats */}
      <DataManagementStats
        totalStocks={summary?.total_stocks ?? EMPTY_TEMPLATE_STRING}
        updated={summary?.updated ?? EMPTY_TEMPLATE_STRING}
        needsUpdate={summary?.needs_update ?? EMPTY_TEMPLATE_STRING}
        totalRecords={
          summary?.total_records?.toLocaleString() ?? EMPTY_TEMPLATE_STRING
        }
      />

      {/* Table */}
      <DataManagementTable
        stocks={stocks}
        isLoading={summaryQuery.isLoading || stocksQuery.isLoading}
        isBusy={isBusy}
        updatingStock={updatingStock}
        onUpdateStock={handleUpdateStock}
        search={trainingSearch}
        onSearchChange={handleTrainingSearchChange}
        statusFilter={trainingStatus}
        onStatusChange={handleTrainingStatusChange}
        total={trainingTotal}
        currentPage={trainingPage}
        totalPages={trainingTotalPages}
        onPageChange={setTrainingPage}
        limit={trainingLimit}
        onLimitChange={handleTrainingLimitChange}
      />
    </>
  );
}
