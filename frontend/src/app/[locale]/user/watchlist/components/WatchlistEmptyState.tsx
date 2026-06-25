"use client";

import { Star } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

type WatchlistEmptyStateProps = {
  searchTerm: string;
};

export function WatchlistEmptyState(props: WatchlistEmptyStateProps) {
  const { searchTerm } = props;
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "border-border bg-card text-card-foreground rounded-xl border p-12",
        "text-center shadow-sm",
      )}
    >
      <Star
        className={cn("mx-auto mb-4 h-16 w-16", "text-muted-foreground/50")}
      />

      <h3 className={cn("mb-2 text-xl", "text-foreground")}>
        {searchTerm
          ? t("watchlist.noStocksFound")
          : t("watchlist.emptyWatchlist")}
      </h3>

      <p className={cn("text-muted-foreground", !searchTerm && "mb-6")}>
        {searchTerm
          ? t("watchlist.trySearchKeyword")
          : t("watchlist.emptyDesc")}
      </p>

      {!searchTerm && (
        <Link
          href="/user/stocks"
          className="bg-brand-900 hover:bg-brand-700 inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          {t("watchlist.goToDirectory")}
        </Link>
      )}
    </div>
  );
}
