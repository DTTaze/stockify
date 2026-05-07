import { WatchlistQuoteItem } from "@/types/watchlist/watchlist.type";
import { cn } from "@/utils";
import { formatLargeNumber } from "@/utils/number";

type WatchlistSummaryProps = {
  watchlist: WatchlistQuoteItem[];
};

export function WatchlistSummary({ watchlist }: WatchlistSummaryProps) {
  const total = watchlist.length;
  const positiveCount = watchlist.filter((item) => item.change > 0).length;
  const negativeCount = watchlist.filter((item) => item.change < 0).length;
  const totalValue = watchlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={cn("grid grid-cols-1 gap-4", "md:grid-cols-4")}>
      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-4",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-1", "text-sm text-gray-600")}>Tổng cổ phiếu</div>

        <div className={cn("text-3xl", "text-brand-900")}>{total}</div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-4",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-1", "text-sm text-gray-600")}>Tăng giá</div>

        <div className={cn("text-3xl", "text-green-600")}>{positiveCount}</div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-4",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-1", "text-sm text-gray-600")}>Giảm giá</div>

        <div className={cn("text-3xl", "text-red-600")}>{negativeCount}</div>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200",
          "bg-white",
          "p-4",
          "shadow-sm",
        )}
      >
        <div className={cn("mb-1", "text-sm text-gray-600")}>Tổng giá trị</div>

        <div className={cn("text-3xl", "text-brand-900")}>
          {formatLargeNumber(totalValue)}
        </div>
      </div>
    </div>
  );
}
