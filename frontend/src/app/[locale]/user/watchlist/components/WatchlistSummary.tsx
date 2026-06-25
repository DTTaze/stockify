"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/providers/LanguageProvider";
import { WatchlistQuoteItem } from "@/types/watchlist/watchlist.type";
import { cn } from "@/utils";

type WatchlistSummaryProps = {
  watchlist: WatchlistQuoteItem[];
  totalInvested: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  isLoading?: boolean;
};

export function WatchlistSummary({
  watchlist,
  totalInvested,
  totalValue,
  profitLoss,
  profitLossPercent,
  isLoading,
}: WatchlistSummaryProps) {
  const { t } = useLanguage();
  const total = watchlist.length;
  const positiveCount = watchlist.filter((item) => item.change > 0).length;
  const negativeCount = watchlist.filter((item) => item.change < 0).length;
  const isProfitable = profitLoss >= 0;

  const cards = [
    {
      label: t("watchlist.totalStocks"),
      value: total,
      textClass: "text-foreground",
    },
    {
      label: t("watchlist.priceUp"),
      value: positiveCount,
      textClass: "text-green-600 dark:text-green-400",
    },
    {
      label: t("watchlist.priceDown"),
      value: negativeCount,
      textClass: "text-red-600 dark:text-red-400",
    },
    {
      label: t("watchlist.investedValue"),
      value: totalInvested.toLocaleString("vi-VN") + " ₫",
      textClass: "text-foreground font-semibold",
    },
    {
      label: t("watchlist.totalValue"),
      value: totalValue.toLocaleString("vi-VN") + " ₫",
      textClass: "text-foreground font-semibold",
    },
    {
      label: t("watchlist.portfolioProfitLoss"),
      value:
        (isProfitable ? "+" : "") +
        profitLoss.toLocaleString("vi-VN") +
        ` ₫ (${isProfitable ? "+" : ""}${profitLossPercent.toFixed(2)}%)`,
      textClass: isProfitable
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div
      className={cn("grid grid-cols-1 gap-4", "md:grid-cols-3 xl:grid-cols-6")}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "border-border rounded-xl border",
            "bg-card text-card-foreground",
            "p-4",
            "shadow-sm",
          )}
        >
          <div className={cn("mb-1", "text-muted-foreground text-sm")}>
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
