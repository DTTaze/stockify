"use client";

import { useState } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Cpu,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Model {
  id: string;
  name: string;
  version: string;
  status: "running" | "stopped" | "training";
  accuracy: number;
  lastTrained: string;
  deployedDate: string;
}

export default function ModelManagement() {
  const [models, setModels] = useState<Model[]>([
    {
      id: "1",
      name: "LSTM-v3",
      version: "3.2.1",
      status: "running",
      accuracy: 89.5,
      lastTrained: "2026-03-18",
      deployedDate: "2026-03-19",
    },
    {
      id: "2",
      name: "GRU-v2",
      version: "2.1.5",
      status: "running",
      accuracy: 87.2,
      lastTrained: "2026-03-15",
      deployedDate: "2026-03-16",
    },
    {
      id: "3",
      name: "Transformer-v1",
      version: "1.0.3",
      status: "stopped",
      accuracy: 85.8,
      lastTrained: "2026-03-10",
      deployedDate: "2026-03-11",
    },
  ]);

  const [trainingModel, setTrainingModel] = useState<string | null>(null);

  const handleTrain = async (modelId: string) => {
    setTrainingModel(modelId);
    setModels(
      models.map((m) =>
        m.id === modelId ? { ...m, status: "training" as const } : m,
      ),
    );

    // Simulate training
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setModels(
      models.map((m) =>
        m.id === modelId
          ? {
              ...m,
              status: "stopped" as const,
              accuracy: m.accuracy + Math.random() * 2,
              lastTrained: new Date().toLocaleDateString("vi-VN"),
            }
          : m,
      ),
    );
    setTrainingModel(null);
  };

  const handleDeploy = (modelId: string) => {
    setModels(
      models.map((m) =>
        m.id === modelId
          ? {
              ...m,
              status: "running" as const,
              deployedDate: new Date().toLocaleDateString("vi-VN"),
            }
          : m,
      ),
    );
  };

  const handleStop = (modelId: string) => {
    setModels(
      models.map((m) =>
        m.id === modelId ? { ...m, status: "stopped" as const } : m,
      ),
    );
  };

  const handleRollback = (modelId: string) => {
    // Simulate rollback to previous version
    alert(`Rollback model ${modelId} to previous version`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1a365d]">Quản lý Model</h1>
          <p className="mt-1 text-gray-600">Quản lý và triển khai AI models</p>
        </div>
        <button className="rounded-lg bg-[#1a365d] px-4 py-2 text-white shadow-md transition-all hover:bg-[#2d4a7c]">
          Thêm Model mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Tổng Models</div>
          <div className="text-3xl text-[#1a365d]">{models.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Đang chạy</div>
          <div className="text-3xl text-green-600">
            {models.filter((m) => m.status === "running").length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Đang train</div>
          <div className="text-3xl text-blue-600">
            {models.filter((m) => m.status === "training").length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Độ chính xác TB</div>
          <div className="text-3xl text-[#d4af37]">
            {(
              models.reduce((sum, m) => sum + m.accuracy, 0) / models.length
            ).toFixed(1)}
            %
          </div>
        </div>
      </div>

      {/* Models List */}
      <div className="space-y-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-xl bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-3">
                  <Cpu className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1a365d]">{model.name}</h3>
                  <p className="text-sm text-gray-500">
                    Version {model.version}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {model.status === "running" ? (
                  <>
                    <div className="rounded-lg bg-green-500 p-1.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
                      Running
                    </span>
                  </>
                ) : model.status === "training" ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      Training...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-gray-400 p-1.5">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                      Stopped
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="mb-1 text-xs text-gray-600">Độ chính xác</div>
                <div className="text-2xl text-[#1a365d]">
                  {model.accuracy.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                <div className="mb-1 text-xs text-gray-600">Train lần cuối</div>
                <div className="text-2xl text-[#1a365d]">
                  {model.lastTrained}
                </div>
              </div>
              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="mb-1 text-xs text-gray-600">Deploy date</div>
                <div className="text-2xl text-[#1a365d]">
                  {model.deployedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTrain(model.id)}
                disabled={model.status === "training"}
                className="flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 transition-all hover:bg-blue-100 disabled:opacity-50"
              >
                <Cpu className="h-4 w-4" />
                <span>Train</span>
              </button>

              {model.status === "running" ? (
                <button
                  onClick={() => handleStop(model.id)}
                  className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition-all hover:bg-red-100"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={() => handleDeploy(model.id)}
                  disabled={model.status === "training"}
                  className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-green-700 transition-all hover:bg-green-100 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  <span>Deploy</span>
                </button>
              )}

              <button
                onClick={() => handleRollback(model.id)}
                className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition-all hover:bg-gray-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Rollback</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
