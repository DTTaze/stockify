import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { ModelStatus } from "@/constants/stock";

interface ModelFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function ModelFilters(props: ModelFiltersProps) {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } = props;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-full">
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm model"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          className="focus:border-brand-500 rounded-md border border-gray-300 p-2 text-sm focus:outline-hidden"
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
