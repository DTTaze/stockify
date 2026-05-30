"use client";

import { Database, Layers, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataClassificationStats } from "@/app/admin/data/components/DataClassificationStats";
import { DataClassificationTable } from "@/app/admin/data/components/DataClassificationTable";
import { DataManagementActions } from "@/app/admin/data/components/DataManagementActions";
import { DataManagementError } from "@/app/admin/data/components/DataManagementError";
import { DataManagementHeader } from "@/app/admin/data/components/DataManagementHeader";
import { DataManagementStats } from "@/app/admin/data/components/DataManagementStats";
import { DataManagementTable } from "@/app/admin/data/components/DataManagementTable";
import { ButtonCustom } from "@/components/common/form/button";
import { EMPTY_TEMPLATE_STRING } from "@/constants/common";
import {
  useQueryDataManagementStocks,
  useQueryDataManagementSummary,
  useUpdateDataManagementAll,
  useUpdateDataManagementSymbol,
} from "@/queries/data-management/QueryHooksDataManagement";
import {
  useQueryClassificationSummary,
  useQueryStocks,
  useSyncClassifications,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

// Dynamic limits will be managed via state

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<"training" | "classification">(
    "training",
  );
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  // Classification states
  const [classificationSearch, setClassificationSearch] = useState("");
  const [classificationPage, setClassificationPage] = useState(1);
  const [classificationGroup, setClassificationGroup] = useState("HOSE");
  const [classificationLimit, setClassificationLimit] = useState(10);

  // Training states
  const [trainingSearch, setTrainingSearch] = useState("");
  const [trainingStatus, setTrainingStatus] = useState<
    "all" | "updated" | "needs_update"
  >("all");
  const [trainingPage, setTrainingPage] = useState(1);
  const [trainingLimit, setTrainingLimit] = useState(10);

  // Training Data Queries & Mutations
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

  // Classification Queries & Mutations
  const classificationSummaryQuery = useQueryClassificationSummary();
  const syncClassificationsMutation = useSyncClassifications();
  const offset = (classificationPage - 1) * classificationLimit;
  const classificationStocksQuery = useQueryStocks({
    group: classificationGroup,
    keyword: classificationSearch.trim() || undefined,
    limit: classificationLimit,
    offset: offset,
  });

  const summary = summaryQuery.data;
  const stocks = stocksQuery.data?.stocks ?? [];
  const trainingTotal = stocksQuery.data?.total ?? 0;
  const trainingTotalPages = Math.ceil(trainingTotal / trainingLimit) || 1;

  const classificationSummary = classificationSummaryQuery.data;
  const classificationStocks = classificationStocksQuery.data?.rows ?? [];
  const classificationTotal = classificationStocksQuery.data?.total ?? 0;
  const classificationTotalPages =
    Math.ceil(classificationTotal / classificationLimit) || 1;

  const hasError =
    summaryQuery.isError ||
    stocksQuery.isError ||
    classificationSummaryQuery.isError;

  const isBusy =
    summaryQuery.isLoading ||
    stocksQuery.isLoading ||
    updateAllMutation.status === "pending" ||
    updateSymbolMutation.status === "pending" ||
    syncClassificationsMutation.isPending;

  const handleUpdateStock = async (symbol: string) => {
    setUpdatingStock(symbol);
    try {
      await updateSymbolMutation.mutateAsync(symbol);
      toast.success(`Cập nhật dữ liệu cho ${symbol} thành công`);
    } catch (err: any) {
      toast.error(`Lỗi cập nhật ${symbol}: ${err.message}`);
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleUpdateAll = async () => {
    setUpdatingStock("all");
    try {
      await updateAllMutation.mutateAsync();
      toast.success("Cập nhật tất cả dữ liệu huấn luyện thành công");
    } catch (err: any) {
      toast.error(`Lỗi cập nhật tất cả: ${err.message}`);
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleSyncClassifications = async () => {
    try {
      await syncClassificationsMutation.mutateAsync();
      toast.success("Đồng bộ phân loại mã chứng khoán từ vnstock thành công!");
    } catch (err: any) {
      toast.error(`Đồng bộ thất bại: ${err.message}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassificationSearch(e.target.value);
    setClassificationPage(1);
  };

  const handleGroupChange = (group: string) => {
    setClassificationGroup(group);
    setClassificationPage(1);
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

  const handleClassificationLimitChange = (newLimit: number) => {
    setClassificationLimit(newLimit);
    setClassificationPage(1);
  };

  const handleTrainingLimitChange = (newLimit: number) => {
    setTrainingLimit(newLimit);
    setTrainingPage(1);
  };

  return (
    <div className={cn("p-6", "space-y-6")}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <DataManagementHeader />

        {activeTab === "training" ? (
          <DataManagementActions
            isBusy={isBusy}
            updatingStock={updatingStock}
            onUpdateAll={handleUpdateAll}
          />
        ) : (
          <div className="flex items-center gap-3">
            <ButtonCustom
              onClick={handleSyncClassifications}
              disabled={isBusy}
              className={cn(
                "flex items-center space-x-2",
                "rounded-lg",
                "px-4 py-2",
                "bg-brand-900 text-white",
                "shadow-md",
                "transition-all",
                "hover:bg-brand-700",
                "disabled:opacity-50",
                "cursor-pointer",
              )}
            >
              <RefreshCw
                className={cn(
                  "h-5 w-5",
                  syncClassificationsMutation.isPending && "animate-spin",
                )}
              />
              <span>Đồng bộ Phân loại (Sync Data)</span>
            </ButtonCustom>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("training")}
          className={cn(
            "cursor-pointer border-b-2 px-4 pb-3 text-sm font-semibold transition-all",
            activeTab === "training"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-gray-500 hover:text-gray-900",
          )}
        >
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dữ liệu Huấn luyện (ML)
          </div>
        </button>
        <button
          onClick={() => setActiveTab("classification")}
          className={cn(
            "cursor-pointer border-b-2 px-4 pb-3 text-sm font-semibold transition-all",
            activeTab === "classification"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-gray-500 hover:text-gray-900",
          )}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Phân loại Chứng khoán
          </div>
        </button>
      </div>

      {hasError && <DataManagementError />}

      {activeTab === "training" ? (
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
      ) : (
        <>
          {/* Classification Stats */}
          <DataClassificationStats summary={classificationSummary} />

          {/* List and search table */}
          <DataClassificationTable
            stocks={classificationStocks}
            total={classificationTotal}
            isLoading={classificationStocksQuery.isLoading}
            search={classificationSearch}
            onSearchChange={handleSearchChange}
            currentPage={classificationPage}
            totalPages={classificationTotalPages}
            onPageChange={setClassificationPage}
            activeGroup={classificationGroup}
            onGroupChange={handleGroupChange}
            limit={classificationLimit}
            onLimitChange={handleClassificationLimitChange}
          />
        </>
      )}
    </div>
  );
}
