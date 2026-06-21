"use client";

import { useEffect, useMemo, useState } from "react";

import { useRemoveFromWatchlist } from "@/queries/watchlist/QueryHooksWatchlist";
import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";
import { PurchaseTransaction } from "@/types/watchlist/watchlist.type";

import { WatchlistEmptyState } from "./components/WatchlistEmptyState";
import { WatchlistHeader } from "./components/WatchlistHeader";
import { WatchlistSummary } from "./components/WatchlistSummary";
import { WatchlistTable } from "./components/WatchlistTable";

export default function WatchListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<
    Record<string, PurchaseTransaction[]>
  >({});

  const { watchlist, isLoading } = useWatchlistWithQuotes();
  const removeMutation = useRemoveFromWatchlist();

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stockify_watchlist_purchases");
    if (saved) {
      try {
        setPurchases(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse purchases", e);
      }
    }
  }, []);

  // Helper to save transactions to state and localStorage
  const savePurchases = (
    newPurchases: Record<string, PurchaseTransaction[]>,
  ) => {
    setPurchases(newPurchases);
    localStorage.setItem(
      "stockify_watchlist_purchases",
      JSON.stringify(newPurchases),
    );
  };

  const handleAddTransaction = (
    symbol: string,
    date: string,
    quantity: number,
    price: number,
  ) => {
    const stockPurchases = purchases[symbol] || [];
    const newTx: PurchaseTransaction = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9),
      symbol,
      purchaseDate: date,
      quantity,
      price,
    };
    const updated = {
      ...purchases,
      [symbol]: [...stockPurchases, newTx],
    };
    savePurchases(updated);
  };

  const handleDeleteTransaction = (symbol: string, transactionId: string) => {
    const stockPurchases = purchases[symbol] || [];
    const updated = {
      ...purchases,
      [symbol]: stockPurchases.filter((tx) => tx.id !== transactionId),
    };
    savePurchases(updated);
  };

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRemove = async (symbol: string) => {
    setRemovingSymbol(symbol);
    try {
      await removeMutation.mutateAsync(symbol);
      // Clean up local transactions for that symbol if removed from watchlist
      const updated = { ...purchases };
      delete updated[symbol];
      savePurchases(updated);
    } finally {
      setRemovingSymbol(null);
    }
  };

  // Compute total portfolio value based on current prices
  const totalPortfolioValue = useMemo(() => {
    let sum = 0;
    watchlist.forEach((item) => {
      const stockPurchases = purchases[item.symbol] || [];
      stockPurchases.forEach((p) => {
        sum += p.quantity * item.price;
      });
    });
    return sum;
  }, [watchlist, purchases]);

  return (
    <div className="space-y-6 p-6">
      <WatchlistHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <WatchlistSummary
        watchlist={watchlist}
        totalValue={totalPortfolioValue}
        isLoading={isLoading}
      />

      <WatchlistTable
        watchlist={filteredWatchlist}
        purchases={purchases}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        removingSymbol={removingSymbol}
        onRemove={handleRemove}
        isLoading={isLoading}
      />

      {!isLoading && filteredWatchlist.length === 0 && (
        <WatchlistEmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
}
