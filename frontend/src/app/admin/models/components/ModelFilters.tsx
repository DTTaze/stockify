import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { ModelStatus } from "@/constants/stock";
import { cn } from "@/utils";

interface ModelFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function ModelFilters(props: ModelFiltersProps) {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } = props;

  return (
    <div className={cn("flex items-center gap-4")}>
      <div className={cn("relative w-full")}>
        <Search
          className={cn("absolute top-3 left-3", "h-4 w-4", "text-gray-400")}
        />
        <Input
          placeholder="Tìm kiếm model"
          className={cn("pl-10")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={cn("flex items-center space-x-2")}>
        <Filter className={cn("h-4 w-4", "text-gray-500")} />
        {/*Chuyển sang sử dụng Componet Select */}
        <select
          className={cn(
            "rounded-md border border-gray-300",
            "p-2",
            "text-sm",
            "focus:border-brand-500 focus:outline-hidden",
          )}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value={ModelStatus.RUNNING}>Đang chạy</option>
          <option value={ModelStatus.STOPPED}>Đã dừng</option>
          <option value={ModelStatus.TRAINING}>Đang train</option>
        </select>
      </div>
    </div>
  );
}
