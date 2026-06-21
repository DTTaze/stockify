import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/utils";

type FiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: "all" | "updated" | "needs_update";
  onStatusChange: (status: "all" | "updated" | "needs_update") => void;
  total: number;
};

export function DataManagementTableFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  total,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm mã cổ phiếu..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-gray-200 bg-white pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs font-medium text-gray-500">
          Tổng số: <span className="text-brand-900 font-bold">{total}</span> mã
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStatusChange("all")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              statusFilter === "all"
                ? "bg-brand-900 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => onStatusChange("updated")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              statusFilter === "updated"
                ? "bg-green-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            Mới nhất
          </button>
          <button
            onClick={() => onStatusChange("needs_update")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              statusFilter === "needs_update"
                ? "bg-orange-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            Cần cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
