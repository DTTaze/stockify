"use client";

import { useState } from "react";

import {
  useAddToWatchlist,
  useQueryMarketList,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";
import { MarketType } from "@/types/stock/stock.type";
import { MarketListItem } from "@/types/watchlist/watchlist.type";

import { AddStockModal } from "./components/AddStockModal";
import { WatchlistEmptyState } from "./components/WatchlistEmptyState";
import { WatchlistHeader } from "./components/WatchlistHeader";
import { WatchlistSummary } from "./components/WatchlistSummary";
import { WatchlistTable } from "./components/WatchlistTable";

export default function WatchListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchTerm, setAddSearchTerm] = useState("");
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);

  const { watchlist, watchlistSymbols, isLoading } = useWatchlistWithQuotes();
  const { data: stockList = [] } = useQueryMarketList(
    MarketType.STOCK,
    showAddModal,
  );
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCompanies = stockList.filter(
    (c: MarketListItem) =>
      c.symbol.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(addSearchTerm.toLowerCase()),
  );

  const handleAdd = async (symbol: string) => {
    await addMutation.mutateAsync(symbol);
    setShowAddModal(false);
    setAddSearchTerm("");
  };

  const handleRemove = async (symbol: string) => {
    setRemovingSymbol(symbol);
    try {
      await removeMutation.mutateAsync(symbol);
    } finally {
      setRemovingSymbol(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <WatchlistHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      <WatchlistSummary watchlist={watchlist} isLoading={isLoading} />

      <WatchlistTable
        watchlist={filteredWatchlist}
        removingSymbol={removingSymbol}
        onRemove={handleRemove}
        isLoading={isLoading}
      />

      {!isLoading && filteredWatchlist.length === 0 && (
        <WatchlistEmptyState searchTerm={searchTerm} />
      )}

      {showAddModal && (
        <AddStockModal
          addSearchTerm={addSearchTerm}
          setAddSearchTerm={setAddSearchTerm}
          onClose={() => {
            setShowAddModal(false);
            setAddSearchTerm("");
          }}
          filteredCompanies={filteredCompanies}
          watchlistSymbols={watchlistSymbols}
          handleAdd={handleAdd}
          isPending={addMutation.isPending}
        />
      )}
    </div>
  );
}
