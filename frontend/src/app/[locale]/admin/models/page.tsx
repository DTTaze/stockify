"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useDeleteModel,
  useDeployModel,
  useGetModels,
  useRestartModel,
  useRollbackModel,
  useTrainModel,
} from "@/queries/model-management/QueryHooksModelManagement";

import { ModelFilters } from "./components/ModelFilters";
import { ModelTable } from "./components/ModelList";
import { ModelStats } from "./components/ModelStats";

export default function ModelManagement() {
  const { data: models = [], isLoading: isModelsLoading } = useGetModels();

  const deployMutation = useDeployModel();
  const rollbackMutation = useRollbackModel();
  const restartMutation = useRestartModel();
  const deleteMutation = useDeleteModel();
  const trainMutation = useTrainModel();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  const handleTrainNewModel = async () => {
    if (!newSymbol.trim()) {
      return;
    }
    try {
      await trainMutation.mutateAsync(newSymbol.trim().toUpperCase());
      toast.success(
        `Đã bắt đầu huấn luyện model cho ${newSymbol.toUpperCase()}`,
      );
      setIsAddModalOpen(false);
      setNewSymbol("");
    } catch {
      toast.error("Lỗi khi khởi chạy huấn luyện");
    }
  };

  const handleTrain = async (symbol: string) => {
    try {
      await trainMutation.mutateAsync(symbol.trim().toUpperCase());
      toast.success(`Đã bắt đầu huấn luyện model cho ${symbol.toUpperCase()}`);
    } catch {
      toast.error("Lỗi khi khởi chạy huấn luyện");
    }
  };

  const handleDeploy = async (id: string) => {
    try {
      await deployMutation.mutateAsync(id);
      toast.success("Model deployed successfully");
    } catch {
      toast.error("Failed to deploy model");
    }
  };

  const handleRollback = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to rollback this model to the previous version?",
      )
    ) {
      try {
        await rollbackMutation.mutateAsync(id);
        toast.success("Model rolled back successfully");
      } catch {
        toast.error("Failed to rollback model");
      }
    }
  };

  const handleRestart = async (id: string) => {
    try {
      await restartMutation.mutateAsync(id);
      toast.success("Model restarted successfully");
    } catch {
      toast.error("Failed to restart model");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this model? This action cannot be undone.",
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Model deleted successfully");
      } catch {
        toast.error("Failed to delete model");
      }
    }
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl">Quản lý Model</h1>
          <p className="mt-1 text-gray-600">Quản lý và triển khai AI models</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-900 hover:bg-brand-800 rounded-lg px-4 py-2 text-white shadow-md transition-all"
        >
          Thêm Model mới
        </button>
      </div>

      <ModelStats models={models} isSummaryLoading={isModelsLoading} />

      <ModelFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ModelTable
        models={filteredModels}
        isLoading={isModelsLoading}
        onTrain={handleTrain}
        onDeploy={handleDeploy}
        onRestart={handleRestart}
        onRollback={handleRollback}
        onDelete={handleDelete}
      />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-brand-900 mb-4 text-xl font-bold">
              Thêm Model mới
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Nhập mã chứng khoán (VD: FPT, HPG, VCB) để bắt đầu huấn luyện mô
              hình dự đoán giá.
            </p>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Mã chứng khoán"
              className="focus:border-brand-500 focus:ring-brand-500 mb-6 w-full rounded-lg border border-gray-300 p-3 uppercase outline-none focus:ring-1"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleTrainNewModel}
                disabled={trainMutation.isPending || !newSymbol.trim()}
                className="bg-brand-900 hover:bg-brand-800 rounded-lg px-4 py-2 text-white disabled:opacity-50"
              >
                {trainMutation.isPending ? "Đang xử lý..." : "Huấn luyện"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
