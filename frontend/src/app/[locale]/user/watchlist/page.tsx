"use client";

import { WatchlistEmptyState } from "./components/WatchlistEmptyState";
import { WatchlistHeader } from "./components/WatchlistHeader";
import { WatchlistSummary } from "./components/WatchlistSummary";
import { WatchlistTable } from "./components/WatchlistTable";
import { useWatchlistPage } from "./hooks/useWatchlistPage";

export type WatchlistFilter = "all" | "up" | "down" | "held";
export type WatchlistSort =
  | "symbol"
  | "price-desc"
  | "change-desc"
  | "volume-desc"
  | "position-desc";

export default function WatchListPage() {
  const {
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
  } = useWatchlistPage();

  return (
    <div className="bg-background text-foreground space-y-6 p-6">
      <WatchlistHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        visibleCount={filteredWatchlist.length}
        totalCount={watchlist.length}
        watchlistCategories={watchlistCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onCreateCategory={handleCreateCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddStockToCategory={handleAddStockToCategory}
        onAddStockToCategories={handleAddStockToMultipleCategories}
      />

      <WatchlistSummary
        watchlist={watchlist}
        totalInvested={portfolioStats.totalInvested}
        totalValue={portfolioStats.totalValue}
        profitLoss={portfolioProfitLoss}
        profitLossPercent={portfolioProfitLossPercent}
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
        thresholds={thresholds}
        onSetThreshold={handleSetThreshold}
      />

      {!isLoading && filteredWatchlist.length === 0 && (
        <WatchlistEmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
}
