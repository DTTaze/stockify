import { Star } from "lucide-react";
import Link from "next/link";

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

      <p className={cn("text-gray-500", !searchTerm && "mb-6")}>
        {searchTerm
          ? "Thử tìm kiếm với từ khóa khác"
          : "Hãy thêm cổ phiếu từ trang Danh mục chứng khoán để theo dõi."}
      </p>

      {!searchTerm && (
        <Link
          href="/user/stocks"
          className="bg-brand-900 hover:bg-brand-700 inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          Đi tới Danh mục
        </Link>
      )}
    </div>
  );
}
