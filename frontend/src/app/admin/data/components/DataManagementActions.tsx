import { Download, RefreshCw, Upload } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";

type Props = {
  isBusy: boolean;
  updatingStock: string | null;
  onUpdateAll: () => void;
};

export function DataManagementActions(props: Props) {
  const { isBusy, updatingStock, onUpdateAll } = props;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonCustom
        onClick={onUpdateAll}
        disabled={isBusy}
        className="bg-brand-900 hover:bg-brand-700 flex items-center space-x-2 rounded-lg px-4 py-2 text-white shadow-md transition-all disabled:opacity-50"
      >
        <RefreshCw
          className={`h-5 w-5 ${updatingStock === "all" ? "animate-spin" : ""}`}
        />

        <span>Cập nhật tất cả</span>
      </ButtonCustom>

      <ButtonCustom className="flex items-center space-x-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
        <Download className="h-5 w-5" />

        <span>Export</span>
      </ButtonCustom>

      <ButtonCustom className="flex items-center space-x-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
        <Upload className="h-5 w-5" />

        <span>Import</span>
      </ButtonCustom>
    </div>
  );
}
