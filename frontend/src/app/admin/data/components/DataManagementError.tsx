import { cn } from "@/utils";

export function DataManagementError() {
  return (
    <div
      className={cn(
        "rounded-xl border border-red-200",
        "p-4",
        "bg-red-50 text-sm text-red-700",
      )}
    >
      Không thể tải dữ liệu quản lý. Vui lòng thử lại sau.
    </div>
  );
}
