import { Plus, Search } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { InputCustom } from "@/components/common/form/input/InputCustom";
import { cn } from "@/utils";

type WatchlistHeaderProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onOpenAddModal: () => void;
};

export function WatchlistHeader(props: WatchlistHeaderProps) {
  const { searchTerm, onSearchTermChange, onOpenAddModal } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div>
        <h1 className={cn("mb-2 text-3xl", "text-brand-900")}>
          Watchlist của tôi
        </h1>

        <p className="text-gray-600">Theo dõi các cổ phiếu yêu thích của bạn</p>
      </div>

      <div className={cn("flex items-center", "space-x-3")}>
        <div className="relative">
          <Search
            className={cn(
              "absolute top-1/2 left-3 h-5 w-5",
              "-translate-y-1/2 transform text-gray-400",
            )}
          />

          <InputCustom
            type="text"
            placeholder="Tìm cổ phiếu..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className={cn(
              "rounded-lg border-2 border-gray-200 py-2 pr-4 pl-10 text-sm outline-none",
              "focus:border-accent-500 focus:ring-accent-500 transition-all focus:ring-2",
            )}
          />
        </div>

        <ButtonCustom
          onClick={onOpenAddModal}
          prefixIcon={<Plus className="h-5 w-5" />}
          bgColor="bg-brand-900 hover:bg-brand-700"
          className={cn("space-x-2 px-4", "shadow-md hover:shadow-lg")}
        >
          Thêm
        </ButtonCustom>
      </div>
    </div>
  );
}
