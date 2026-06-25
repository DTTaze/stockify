import { Filter, Search } from "lucide-react";
import { useMemo } from "react";

import { Input } from "@/components/ui/Input";
import { ModelStatus } from "@/constants/stock";
import { ModelItem } from "@/types/model-management";
import { cn } from "@/utils";

interface ModelFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  envFilter: string;
  setEnvFilter: (value: string) => void;
  models: ModelItem[];
}

export function ModelFilters(props: ModelFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    envFilter,
    setEnvFilter,
    models,
  } = props;

  // Extract unique model types from models dynamically
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    models.forEach((m) => {
      if (m.type) {
        types.add(m.type);
      }
    });
    return Array.from(types);
  }, [models]);

  // Extract unique environments from models dynamically
  const uniqueEnvs = useMemo(() => {
    const envs = new Set<string>();
    models.forEach((m) => {
      if (m.environment) {
        envs.add(m.environment);
      }
    });
    return Array.from(envs);
  }, [models]);

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center")}>
      <div className={cn("relative w-full max-w-md")}>
        <Search
          className={cn("absolute top-3 left-3", "h-4 w-4", "text-gray-400")}
        />
        <Input
          placeholder="Tìm kiếm model..."
          className={cn("pl-10")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={cn("flex flex-wrap items-center gap-3")}>
        <div className={cn("flex items-center space-x-2")}>
          <Filter className={cn("h-4 w-4", "text-gray-500")} />
          <span className="text-xs text-gray-500">Trạng thái:</span>
          <select
            className={cn(
              "rounded-md border border-gray-300 bg-white",
              "p-2 text-sm text-gray-700 outline-none",
              "focus:border-brand-500",
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

        {uniqueTypes.length > 0 && (
          <div className={cn("flex items-center space-x-2")}>
            <span className="text-xs font-medium text-gray-500">Mô hình:</span>
            <select
              className={cn(
                "rounded-md border border-gray-300 bg-white",
                "p-2 text-sm text-gray-700 outline-none",
                "focus:border-brand-500",
              )}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        {uniqueEnvs.length > 0 && (
          <div className={cn("flex items-center space-x-2")}>
            <span className="text-xs font-medium text-gray-500">
              Môi trường:
            </span>
            <select
              className={cn(
                "rounded-md border border-gray-300 bg-white",
                "p-2 text-sm text-gray-700 outline-none",
                "focus:border-brand-500",
              )}
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
            >
              <option value="all">Tất cả môi trường</option>
              {uniqueEnvs.map((env) => (
                <option key={env} value={env}>
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
