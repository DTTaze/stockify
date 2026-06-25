import { PredictionTrend } from "@/constants/stock";
import {
  PurchaseTransaction,
  WatchlistQuoteItem,
} from "@/types/watchlist/watchlist.type";

import type { WatchlistFilter, WatchlistSort } from "../page";

export const getCurrentMarketPrice = (item: WatchlistQuoteItem) =>
  item.price * 1000;

export const getStockPurchases = (
  purchases: Record<string, PurchaseTransaction[]>,
  symbol: string,
) => purchases[symbol] || [];

export const getPositionValue = (
  item: WatchlistQuoteItem,
  purchases: Record<string, PurchaseTransaction[]>,
) =>
  getStockPurchases(purchases, item.symbol).reduce(
    (sum, purchase) => sum + purchase.quantity * getCurrentMarketPrice(item),
    0,
  );

export function getFilteredAndSortedWatchlist(
  watchlist: WatchlistQuoteItem[],
  searchTerm: string,
  activeFilter: WatchlistFilter,
  activeSort: WatchlistSort,
  purchases: Record<string, PurchaseTransaction[]>,
) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const matchingWatchlist = watchlist.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(normalizedSearchTerm) ||
      item.name.toLowerCase().includes(normalizedSearchTerm);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === "up") {
      return item.prediction === PredictionTrend.UP;
    }

    if (activeFilter === "down") {
      return item.prediction === PredictionTrend.DOWN;
    }

    if (activeFilter === "held") {
      return getStockPurchases(purchases, item.symbol).length > 0;
    }

    return true;
  });

  return [...matchingWatchlist].sort((first, second) => {
    if (activeSort === "price-desc") {
      return second.price - first.price;
    }

    if (activeSort === "change-desc") {
      return second.change - first.change;
    }

    if (activeSort === "volume-desc") {
      return second.volume - first.volume;
    }

    if (activeSort === "position-desc") {
      return (
        getPositionValue(second, purchases) - getPositionValue(first, purchases)
      );
    }

    return first.symbol.localeCompare(second.symbol);
  });
}

export function calculatePortfolioStats(
  watchlist: WatchlistQuoteItem[],
  purchases: Record<string, PurchaseTransaction[]>,
) {
  return watchlist.reduce(
    (stats, item) => {
      const stockPurchases = getStockPurchases(purchases, item.symbol);
      const currentPrice = getCurrentMarketPrice(item);

      stockPurchases.forEach((purchase) => {
        stats.totalInvested += purchase.quantity * purchase.price;
        stats.totalValue += purchase.quantity * currentPrice;
      });

      return stats;
    },
    {
      totalInvested: 0,
      totalValue: 0,
    },
  );
}
