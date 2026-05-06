import { cn } from "@/utils";

export function DataManagementHeader() {
  return (
    <div>
      <h1 className={cn("text-3xl", "text-brand-900")}>Quản lý Dữ liệu</h1>

      <p className={cn("mt-1", "text-gray-600")}>
        Cập nhật và quản lý dữ liệu cổ phiếu
      </p>
    </div>
  );
}
