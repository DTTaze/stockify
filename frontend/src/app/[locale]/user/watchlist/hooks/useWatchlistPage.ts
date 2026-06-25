"use client";

import { useEffect, useMemo, useState } from "react";

import {
  useAddToWatchlist,
  useQueryWatchlist,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";
import { PurchaseTransaction } from "@/types/watchlist/watchlist.type";

import type { WatchlistFilter, WatchlistSort } from "../page";
import { useWatchlistCategories } from "./useWatchlistCategories";
import {
  calculatePortfolioStats,
  getFilteredAndSortedWatchlist,
} from "./watchlistHelpers";

export function useWatchlistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<WatchlistFilter>("all");
  const [activeSort, setActiveSort] = useState<WatchlistSort>("symbol");
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<
    Record<string, PurchaseTransaction[]>
  >({});
  const [thresholds, setThresholds] = useState<Record<string, number>>({});

  const {
    watchlistCategories,
    selectedCategory,
    categoryMappings,
    setCategoryMappings,
    handleSelectCategory,
    handleCreateCategory,
    handleRenameCategory,
    handleDeleteCategory,
  } = useWatchlistCategories();

  const { data: dbWatchlistItems = [] } = useQueryWatchlist();

  const activeSymbols = useMemo(() => {
    const activeCatSymbols = categoryMappings[selectedCategory] || [];
    if (
      selectedCategory === "Danh mục của tôi" &&
      activeCatSymbols.length === 0 &&
      dbWatchlistItems.length > 0
    ) {
      return dbWatchlistItems.map((item) => item.symbol);
    }
    return activeCatSymbols;
  }, [categoryMappings, selectedCategory, dbWatchlistItems]);

  const { watchlist, isLoading } = useWatchlistWithQuotes(activeSymbols);
  const removeMutation = useRemoveFromWatchlist();
  const addToWatchlistMutation = useAddToWatchlist();

  // Load transactions and thresholds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stockify_watchlist_purchases");
    if (saved) {
      try {
        setPurchases(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse purchases", e);
      }
    }

    const savedThresholds = localStorage.getItem(
      "stockify_watchlist_thresholds",
    );
    if (savedThresholds) {
      try {
        setThresholds(JSON.parse(savedThresholds));
      } catch (e) {
        console.error("Failed to parse watchlist thresholds", e);
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

  const handleAddStockToCategory = async (symbol: string) => {
    const upperSymbol = symbol.trim().toUpperCase();
    if (!upperSymbol) {
      return;
    }

    const activeCatSymbols = categoryMappings[selectedCategory] || [];
    let initialSymbols = activeCatSymbols;
    if (
      selectedCategory === "Danh mục của tôi" &&
      activeCatSymbols.length === 0
    ) {
      initialSymbols = dbWatchlistItems.map((item) => item.symbol);
    }

    if (initialSymbols.includes(upperSymbol)) {
      return;
    }

    const updatedSymbols = [...initialSymbols, upperSymbol];
    const updatedMappings = {
      ...categoryMappings,
      [selectedCategory]: updatedSymbols,
    };
    setCategoryMappings(updatedMappings);
    localStorage.setItem(
      "stockify_category_symbols",
      JSON.stringify(updatedMappings),
    );

    if (selectedCategory === "Danh mục của tôi") {
      try {
        await addToWatchlistMutation.mutateAsync(upperSymbol);
      } catch (err) {
        console.error("Failed to sync adding stock with backend", err);
      }
    }
  };

  const handleAddStockToMultipleCategories = async (
    symbol: string,
    targetCategories: string[],
  ) => {
    const upperSymbol = symbol.trim().toUpperCase();
    if (!upperSymbol) {
      return;
    }

    const updatedMappings = { ...categoryMappings };

    for (const cat of targetCategories) {
      const activeCatSymbols = updatedMappings[cat] || [];
      let initialSymbols = activeCatSymbols;
      if (cat === "Danh mục của tôi" && activeCatSymbols.length === 0) {
        initialSymbols = dbWatchlistItems.map((item) => item.symbol);
      }

      if (!initialSymbols.includes(upperSymbol)) {
        updatedMappings[cat] = [...initialSymbols, upperSymbol];
      }
    }

    setCategoryMappings(updatedMappings);
    localStorage.setItem(
      "stockify_category_symbols",
      JSON.stringify(updatedMappings),
    );

    if (targetCategories.includes("Danh mục của tôi")) {
      try {
        await addToWatchlistMutation.mutateAsync(upperSymbol);
      } catch (err) {
        console.error("Failed to sync adding stock with backend", err);
      }
    }
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

  const filteredWatchlist = useMemo(() => {
    return getFilteredAndSortedWatchlist(
      watchlist,
      searchTerm,
      activeFilter,
      activeSort,
      purchases,
    );
  }, [watchlist, searchTerm, activeFilter, activeSort, purchases]);

  const handleRemove = async (symbol: string) => {
    setRemovingSymbol(symbol);
    try {
      const activeCatSymbols = categoryMappings[selectedCategory] || [];
      let initialSymbols = activeCatSymbols;
      if (
        selectedCategory === "Danh mục của tôi" &&
        activeCatSymbols.length === 0
      ) {
        initialSymbols = dbWatchlistItems.map((item) => item.symbol);
      }

      const updatedSymbols = initialSymbols.filter((s) => s !== symbol);
      const updatedMappings = {
        ...categoryMappings,
        [selectedCategory]: updatedSymbols,
      };

      setCategoryMappings(updatedMappings);
      localStorage.setItem(
        "stockify_category_symbols",
        JSON.stringify(updatedMappings),
      );

      if (selectedCategory === "Danh mục của tôi") {
        await removeMutation.mutateAsync(symbol);
      }

      const updated = { ...purchases };
      delete updated[symbol];
      savePurchases(updated);
    } catch (err) {
      console.error("Failed to remove stock", err);
    } finally {
      setRemovingSymbol(null);
    }
  };

  const portfolioStats = useMemo(() => {
    return calculatePortfolioStats(watchlist, purchases);
  }, [watchlist, purchases]);

  const portfolioProfitLoss =
    portfolioStats.totalValue - portfolioStats.totalInvested;
  const portfolioProfitLossPercent =
    portfolioStats.totalInvested > 0
      ? (portfolioProfitLoss / portfolioStats.totalInvested) * 100
      : 0;

  const handleSetThreshold = (symbol: string, value: number) => {
    const updated = {
      ...thresholds,
      [symbol]: value,
    };
    setThresholds(updated);
    localStorage.setItem(
      "stockify_watchlist_thresholds",
      JSON.stringify(updated),
    );
    window.dispatchEvent(new Event("stockify_threshold_changed"));
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    activeSort,
    setActiveSort,
    removingSymbol,
    purchases,
    watchlistCategories,
    selectedCategory,
    watchlist,
    isLoading,
    filteredWatchlist,
    portfolioProfitLoss,
    portfolioProfitLossPercent,
    portfolioStats,
    handleSelectCategory,
    handleCreateCategory,
    handleRenameCategory,
    handleDeleteCategory,
    handleAddStockToCategory,
    handleAddStockToMultipleCategories,
    handleAddTransaction,
    handleDeleteTransaction,
    handleRemove,
    thresholds,
    handleSetThreshold,
  };
}
