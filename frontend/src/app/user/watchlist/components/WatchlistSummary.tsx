import { Skeleton } from "@/components/ui/Skeleton";
import { WatchlistQuoteItem } from "@/types/watchlist/watchlist.type";
import { cn } from "@/utils";

type WatchlistSummaryProps = {
  watchlist: WatchlistQuoteItem[];
  totalValue: number;
  isLoading?: boolean;
};

export function WatchlistSummary({
  watchlist,
  totalValue,
  isLoading,
}: WatchlistSummaryProps) {
  const total = watchlist.length;
  const positiveCount = watchlist.filter((item) => item.change > 0).length;
  const negativeCount = watchlist.filter((item) => item.change < 0).length;

  const cards = [
    { label: "Tổng cổ phiếu", value: total, textClass: "text-brand-900" },
    { label: "Tăng giá", value: positiveCount, textClass: "text-green-600" },
    { label: "Giảm giá", value: negativeCount, textClass: "text-red-600" },
    {
      label: "Tổng giá trị",
      value: totalValue.toLocaleString("vi-VN") + " ₫",
      textClass: "text-brand-900 font-semibold",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 gap-4", "md:grid-cols-4")}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "rounded-xl border border-gray-200",
            "bg-white",
            "p-4",
            "shadow-sm",
          )}
        >
          <div className={cn("mb-1", "text-sm text-gray-600")}>
            {card.label}
          </div>

          {isLoading ? (
            <Skeleton className="mt-1 h-9 w-20" />
          ) : (
            <div className={cn("text-3xl", card.textClass)}>{card.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}
