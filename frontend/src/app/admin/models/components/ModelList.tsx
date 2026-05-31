import {
  AlertCircle,
  CheckCircle,
  Cpu,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

import ModelListSkeleton from "@/app/admin/models/components/ModelListSkeleton";
import { ButtonCustom } from "@/components/common/form/button";
import { EMPTY_TEMPLATE_STRING } from "@/constants/common";
import { ModelStatus } from "@/constants/stock";
import { ModelItem } from "@/types/model-management";
import { cn } from "@/utils";

interface ModelTableProps {
  models: (ModelItem & {
    metrics?: { accuracy?: number };
    training_info?: { last_trained?: string };
  })[];
  isLoading: boolean;
  onTrain: (id: string) => void;
  onDeploy: (id: string) => void;
  onRestart: (id: string) => void;
  onRollback: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ModelTable(props: ModelTableProps) {
  const {
    models,
    isLoading,
    onTrain,
    onDeploy,
    onRestart,
    onRollback,
    onDelete,
  } = props;

  if (isLoading) {
    return <ModelListSkeleton />;
  }

  if (models.length === 0) {
    return (
      <div className={cn("py-8", "text-center", "text-gray-500")}>
        Không tìm thấy model nào.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4")}>
      {models.map((model) => {
        const accuracy = model.metrics?.accuracy || 0;
        const lastTrained = model.training_info?.last_trained
          ? new Date(model.training_info.last_trained).toLocaleDateString(
              "vi-VN",
            )
          : EMPTY_TEMPLATE_STRING;
        const deployedDate = model.updated_at
          ? new Date(model.updated_at).toLocaleDateString("vi-VN")
          : EMPTY_TEMPLATE_STRING;

        return (
          <div
            key={model.id}
            className={cn(
              "rounded-xl border border-gray-200",
              "bg-white",
              "p-6",
              "shadow-sm transition-shadow hover:shadow-md",
            )}
          >
            <div className={cn("mb-4", "flex items-center justify-between")}>
              <div className={cn("flex items-center space-x-4")}>
                <div
                  className={cn(
                    "rounded-xl",
                    "from-brand-900 bg-linear-to-br to-[#2d4a7c]",
                    "p-3",
                  )}
                >
                  <Cpu className={cn("h-8 w-8", "text-brand-900")} />
                </div>

                <div>
                  <h3 className={cn("text-xl font-semibold", "text-brand-900")}>
                    {model.name}
                  </h3>
                  <p className={cn("text-sm", "text-gray-500")}>
                    Version {model.version}
                  </p>
                </div>
              </div>

              <div className={cn("flex items-center space-x-2")}>
                {model.status === ModelStatus.RUNNING ? (
                  <>
                    <div className={cn("rounded-lg", "bg-green-500", "p-1.5")}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full border border-green-200",
                        "bg-green-50",
                        "px-3 py-1",
                        "text-sm text-green-700",
                      )}
                    >
                      Running
                    </span>
                  </>
                ) : model.status === ModelStatus.TRAINING ? (
                  <>
                    <div
                      className={cn(
                        "h-5 w-5",
                        "animate-spin",
                        "rounded-full border-2 border-blue-500 border-t-transparent",
                      )}
                    />
                    <span
                      className={cn(
                        "rounded-full border border-blue-200",
                        "bg-blue-50",
                        "px-3 py-1",
                        "text-sm text-blue-700",
                      )}
                    >
                      Training...
                    </span>
                  </>
                ) : (
                  <>
                    <div className={cn("rounded-lg", "bg-gray-400", "p-1.5")}>
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full border border-gray-200",
                        "bg-gray-50",
                        "px-3 py-1",
                        "text-sm text-gray-700",
                      )}
                    >
                      Stopped
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              className={cn("mb-4", "grid grid-cols-1 gap-4", "md:grid-cols-3")}
            >
              <div
                className={cn(
                  "rounded-xl border border-blue-100",
                  "bg-linear-to-br from-blue-50 to-indigo-50",
                  "p-4",
                )}
              >
                <div className={cn("mb-1", "text-xs text-gray-600")}>
                  Độ chính xác
                </div>
                <div className={cn("text-2xl", "text-brand-900")}>
                  {accuracy.toFixed(1)}%
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl border border-green-100",
                  "bg-linear-to-br from-green-50 to-emerald-50",
                  "p-4",
                )}
              >
                <div className={cn("mb-1", "text-xs text-gray-600")}>
                  Train lần cuối
                </div>
                <div className={cn("text-2xl", "text-brand-900")}>
                  {lastTrained}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl border border-purple-100",
                  "bg-linear-to-br from-purple-50 to-pink-50",
                  "p-4",
                )}
              >
                <div className={cn("mb-1", "text-xs text-gray-600")}>
                  Deploy date
                </div>
                <div className={cn("text-2xl", "text-brand-900")}>
                  {deployedDate}
                </div>
              </div>
            </div>

            <div className={cn("flex items-center justify-between")}>
              <div className={cn("flex items-center space-x-3")}>
                <ButtonCustom
                  onClick={() => onTrain(model.id)}
                  disabled={model.status === ModelStatus.TRAINING}
                  className={cn(
                    "flex items-center space-x-2",
                    "rounded-lg border border-blue-200",
                    "px-4 py-2",
                    "bg-blue-50 text-blue-700",
                    "transition-all",
                    "hover:bg-blue-100",
                    "disabled:opacity-50",
                  )}
                >
                  <Cpu className="h-4 w-4" />
                  <span>Train</span>
                </ButtonCustom>

                {model.status === ModelStatus.RUNNING ? (
                  <ButtonCustom
                    onClick={() => onRestart(model.id)}
                    className={cn(
                      "flex items-center space-x-2",
                      "rounded-lg border border-yellow-200",
                      "px-4 py-2",
                      "bg-yellow-50 text-yellow-700",
                      "transition-all",
                      "hover:bg-yellow-100",
                    )}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Restart</span>
                  </ButtonCustom>
                ) : (
                  <ButtonCustom
                    onClick={() => onDeploy(model.id)}
                    disabled={model.status === ModelStatus.TRAINING}
                    className={cn(
                      "flex items-center space-x-2",
                      "rounded-lg border border-green-200",
                      "px-4 py-2",
                      "bg-green-50 text-green-700",
                      "transition-all",
                      "hover:bg-green-100",
                      "disabled:opacity-50",
                    )}
                  >
                    <Play className="h-4 w-4" />
                    <span>Deploy</span>
                  </ButtonCustom>
                )}

                <ButtonCustom
                  onClick={() => onRollback(model.id)}
                  className={cn(
                    "flex items-center space-x-2",
                    "rounded-lg border border-gray-200",
                    "px-4 py-2",
                    "bg-gray-50 text-gray-700",
                    "transition-all",
                    "hover:bg-gray-100",
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Rollback</span>
                </ButtonCustom>
              </div>

              <ButtonCustom
                onClick={() => onDelete(model.id)}
                className={cn(
                  "flex items-center space-x-2",
                  "rounded-lg border border-red-200",
                  "px-4 py-2",
                  "bg-red-50 text-red-700",
                  "transition-all",
                  "hover:bg-red-100",
                )}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </ButtonCustom>
            </div>
          </div>
        );
      })}
    </div>
  );
}
