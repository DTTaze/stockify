import { Download, RefreshCw, Upload } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { cn } from "@/utils";

interface Props {
  isBusy: boolean;
  updatingStock: string | null;
  onUpdateAll: () => void;
}

export function DataManagementActions(props: Props) {
  const { isBusy, updatingStock, onUpdateAll } = props;

  return (
    <div className={cn("flex flex-wrap items-center gap-3")}>
      <ButtonCustom
        onClick={onUpdateAll}
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
        )}
      >
        <RefreshCw
          className={cn("h-5 w-5", updatingStock === "all" && "animate-spin")}
        />

        <span>Cập nhật tất cả</span>
      </ButtonCustom>

      <ButtonCustom
        className={cn(
          "flex items-center space-x-2",
          "rounded-lg border-2 border-gray-200",
          "px-4 py-2",
          "bg-white text-gray-700",
          "hover:bg-gray-50",
        )}
      >
        <Download className="h-5 w-5" />
        <span>Export</span>
      </ButtonCustom>

      <ButtonCustom
        className={cn(
          "flex items-center space-x-2",
          "rounded-lg border-2 border-gray-200",
          "px-4 py-2",
          "bg-white text-gray-700",
          "hover:bg-gray-50",
        )}
      >
        <Upload className="h-5 w-5" />
        <span>Import</span>
      </ButtonCustom>
    </div>
  );
}
