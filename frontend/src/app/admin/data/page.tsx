"use client";

import { Database, Layers, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ClassificationDataSection } from "@/app/admin/data/components/ClassificationDataSection";
import { DataManagementHeader } from "@/app/admin/data/components/DataManagementHeader";
import { TrainingDataSection } from "@/app/admin/data/components/TrainingDataSection";
import { ButtonCustom } from "@/components/common/form/button";
import { useSyncAdminStockPrices } from "@/queries/admin/QueryHooksAdmin";
import {
  useSyncAllCategories,
  useSyncIcbIndustries,
  useSyncMarketGroups,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<"training" | "classification">(
    "training",
  );
  const [isTrainingBusy, setIsTrainingBusy] = useState(false);

  // Sync Mutations
  const syncMarketGroupsMutation = useSyncMarketGroups();
  const syncIcbIndustriesMutation = useSyncIcbIndustries();
  const syncAllCategoriesMutation = useSyncAllCategories();
  const syncStockPricesMutation = useSyncAdminStockPrices();

  const isBusy =
    isTrainingBusy ||
    syncMarketGroupsMutation.isPending ||
    syncIcbIndustriesMutation.isPending ||
    syncAllCategoriesMutation.isPending ||
    syncStockPricesMutation.isPending;

  const handleSyncMarketGroups = async () => {
    try {
      await syncMarketGroupsMutation.mutateAsync();
      toast.success("Đồng bộ dữ liệu nhóm thị trường từ vnstock thành công!");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đồng bộ nhóm thị trường thất bại: ${message}`);
    }
  };

  const handleSyncIcbIndustries = async () => {
    try {
      await syncIcbIndustriesMutation.mutateAsync();
      toast.success("Đồng bộ dữ liệu ngành ICB từ vnstock thành công!");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đồng bộ ngành ICB thất bại: ${message}`);
    }
  };

  const handleSyncAllCategories = async () => {
    try {
      await syncAllCategoriesMutation.mutateAsync();
      toast.success("Đồng bộ toàn bộ dữ liệu phân loại từ vnstock thành công!");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đồng bộ toàn bộ phân loại thất bại: ${message}`);
    }
  };

  const handleSyncAllPrices = async () => {
    try {
      const result = await syncStockPricesMutation.mutateAsync();
      toast.success(
        `Đồng bộ dữ liệu giá cổ phiếu thành công. Cập nhật ${result.syncedRecords} bản ghi cho ${result.totalSymbols} mã.`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đồng bộ giá thất bại: ${message}`);
    }
  };

  return (
    <div className={cn("p-6", "space-y-6")}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <DataManagementHeader />

        {activeTab === "training" ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {isTrainingBusy
                ? "Đang cập nhật dữ liệu huấn luyện..."
                : "Sẵn sàng"}
            </span>
            <ButtonCustom
              onClick={handleSyncAllPrices}
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
                  "h-4 w-4",
                  syncStockPricesMutation.isPending && "animate-spin",
                )}
              />
              <span>Cập nhật dữ liệu giá cổ phiếu</span>
            </ButtonCustom>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <ButtonCustom
              onClick={handleSyncMarketGroups}
              disabled={isBusy}
              className={cn(
                "flex items-center space-x-2",
                "rounded-lg",
                "px-4 py-2",
                "bg-blue-600 text-white",
                "shadow-md",
                "transition-all",
                "hover:bg-blue-700",
                "disabled:opacity-50",
                "cursor-pointer",
              )}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  syncMarketGroupsMutation.isPending && "animate-spin",
                )}
              />
              <span>Sync Market Groups</span>
            </ButtonCustom>

            <ButtonCustom
              onClick={handleSyncIcbIndustries}
              disabled={isBusy}
              className={cn(
                "flex items-center space-x-2",
                "rounded-lg",
                "px-4 py-2",
                "bg-amber-600 text-white",
                "shadow-md",
                "transition-all",
                "hover:bg-amber-700",
                "disabled:opacity-50",
                "cursor-pointer",
              )}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  syncIcbIndustriesMutation.isPending && "animate-spin",
                )}
              />
              <span>Sync ICB Industries</span>
            </ButtonCustom>

            <ButtonCustom
              onClick={handleSyncAllCategories}
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
                  "h-4 w-4",
                  syncAllCategoriesMutation.isPending && "animate-spin",
                )}
              />
              <span>Sync All Categories</span>
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

      {activeTab === "training" ? (
        <TrainingDataSection
          isParentBusy={isBusy}
          onBusyChange={setIsTrainingBusy}
        />
      ) : (
        <ClassificationDataSection />
      )}
    </div>
  );
}
