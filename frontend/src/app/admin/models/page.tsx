"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useDeleteModel,
  useDeployModel,
  useGetModels,
  useRestartModel,
  useRollbackModel,
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleDeploy = async (id: string) => {
    try {
      await deployMutation.mutateAsync(id);
      toast.success("Model deployed successfully");
    } catch (error) {
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
      } catch (error) {
        toast.error("Failed to rollback model");
      }
    }
  };

  const handleRestart = async (id: string) => {
    try {
      await restartMutation.mutateAsync(id);
      toast.success("Model restarted successfully");
    } catch (error) {
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
      } catch (error) {
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
        <button className="bg-brand-900 hover:bg-brand-800 rounded-lg px-4 py-2 text-white shadow-md transition-all">
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
        onDeploy={handleDeploy}
        onRestart={handleRestart}
        onRollback={handleRollback}
        onDelete={handleDelete}
      />
    </div>
  );
}
