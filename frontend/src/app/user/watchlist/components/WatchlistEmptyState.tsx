import { Star } from "lucide-react";

import { cn } from "@/utils";

type WatchlistEmptyStateProps = {
  searchTerm: string;
};

export function WatchlistEmptyState(props: WatchlistEmptyStateProps) {
  const { searchTerm } = props;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-12",
        "text-center shadow-sm",
      )}
    >
      <Star className={cn("mx-auto mb-4 h-16 w-16", "text-gray-300")} />

      <h3 className={cn("mb-2 text-xl", "text-gray-600")}>
        {searchTerm ? "Không tìm thấy cổ phiếu" : "Watchlist trống"}
      </h3>

      <p className="text-gray-500">
        {searchTerm
          ? "Thử tìm kiếm với từ khóa khác"
          : "Nhấn + Thêm để bắt đầu theo dõi cổ phiếu"}
      </p>
    </div>
  );
}
