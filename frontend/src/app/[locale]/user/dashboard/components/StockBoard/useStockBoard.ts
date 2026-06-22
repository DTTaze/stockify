import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import { getStockQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import { useQueryStocks } from "@/queries/stocks/QueryHooksStocks";
import {
  useAddToWatchlist,
  useQueryWatchlist,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

export const BOARD_TABS = [
  { id: "AI", label: "Cổ phiếu AI", translationKey: "boardTabAi" },
  { id: "WATCHLIST", label: "Theo dõi", translationKey: "boardTabWatchlist" },
  { id: "VN30", label: "Chỉ số VN30", translationKey: "boardTabVn30" },
] as const;

export const ITEMS_PER_PAGE = 12;

export function useStockBoard() {
  const [activeTab, setActiveTab] = useState<string>("AI");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  // Watchlist hooks
  const { data: watchlistItems = [] } = useQueryWatchlist();
  const { watchlist: watchlistQuotes, isLoading: isWatchlistLoading } =
    useWatchlistWithQuotes();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const watchlistSymbols = useMemo(
    () => new Set(watchlistItems.map((item) => item.symbol)),
    [watchlistItems],
  );

  // LSTM Trained Models
  const { data: models = [], isLoading: isModelsLoading } = useGetModels();
  const trainedSymbols = useMemo(() => models.map((m) => m.id), [models]);

  // Market classification query
  const marketOffset = (currentPage - 1) * ITEMS_PER_PAGE;
  const isMarketTab = activeTab === "VN30";

  const { data: marketData, isLoading: isMarketLoading } = useQueryStocks(
    isMarketTab
      ? {
          group: activeTab,
          keyword: searchQuery.trim() || undefined,
          limit: ITEMS_PER_PAGE,
          offset: marketOffset,
        }
      : undefined,
  );

  const marketStocks = useMemo(() => marketData?.rows ?? [], [marketData]);
  const marketTotal = marketData?.total ?? 0;

  // Filter trained symbols for AI
  const filteredAiSymbols = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return trainedSymbols.filter((s) => s.toLowerCase().includes(q));
    }
    return trainedSymbols;
  }, [trainedSymbols, searchQuery]);

  // Filter watchlist symbols
  const filteredWatchlistSymbols = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = watchlistQuotes.map((w) => w.symbol);
    if (q) {
      return list.filter((s) => s.toLowerCase().includes(q));
    }
    return list;
  }, [watchlistQuotes, searchQuery]);

  // Calculate total items and total pages based on tab
  const totalItems = useMemo(() => {
    if (activeTab === "AI") {
      return filteredAiSymbols.length;
    }
    if (activeTab === "WATCHLIST") {
      return filteredWatchlistSymbols.length;
    }
    return marketTotal;
  }, [
    activeTab,
    filteredAiSymbols.length,
    filteredWatchlistSymbols.length,
    marketTotal,
  ]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  }, [totalItems]);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Resolve symbols for the active tab to fetch quotes dynamically (paginated)
  const activeSymbols = useMemo(() => {
    if (activeTab === "AI") {
      return filteredAiSymbols.slice(offset, offset + ITEMS_PER_PAGE);
    }
    if (activeTab === "WATCHLIST") {
      return filteredWatchlistSymbols.slice(offset, offset + ITEMS_PER_PAGE);
    }
    return marketStocks.map((s) => s.symbol);
  }, [
    activeTab,
    filteredAiSymbols,
    filteredWatchlistSymbols,
    marketStocks,
    offset,
  ]);

  // Fetch Quotes in parallel for the visible symbols
  const quoteQueries = useQueries({
    queries: activeSymbols.map((symbol) => ({
      queryKey: ["stock-quote-dynamic", symbol],
      queryFn: () =>
        getStockQuoteQueryFn({
          symbol,
          type: MarketType.STOCK,
          period: TimePeriod.ONE_DAY,
        }),
      refetchInterval: 10000,
      enabled: activeTab !== "WATCHLIST",
    })),
  });

  const isQuotesLoading = quoteQueries.some((q) => q.isLoading);

  // Merge stocks with quotes
  const boardRows = useMemo(() => {
    if (activeTab === "WATCHLIST") {
      const filtered = watchlistQuotes.filter((w) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          w.symbol.toLowerCase().includes(q) || w.name.toLowerCase().includes(q)
        );
      });
      return filtered.slice(offset, offset + ITEMS_PER_PAGE).map((w) => ({
        symbol: w.symbol,
        name: w.name,
        price: w.price,
        change: w.change,
        volume: w.volume,
        exchange: "HOSE",
      }));
    }

    return activeSymbols.map((symbol, index) => {
      const queryResult = quoteQueries[index];
      const quote = queryResult?.data;
      const marketStock = marketStocks.find((s) => s.symbol === symbol);
      const isTrained = trainedSymbols.includes(symbol);

      return {
        symbol,
        name: isTrained ? `${symbol} LSTM Predictor` : "Cổ phiếu niêm yết",
        price: quote?.price ?? 0,
        change: quote?.change_percent ?? 0,
        volume: quote?.volume ?? 0,
        exchange:
          marketStock?.exchange ??
          (symbol === "VCB" || symbol === "FPT" ? "HOSE" : "HNX"),
      };
    });
  }, [
    activeTab,
    activeSymbols,
    quoteQueries,
    watchlistQuotes,
    trainedSymbols,
    searchQuery,
    marketStocks,
    offset,
  ]);

  const isLoading =
    activeTab === "AI"
      ? isModelsLoading || isQuotesLoading
      : activeTab === "WATCHLIST"
        ? isWatchlistLoading
        : isMarketLoading || isQuotesLoading;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleWatchlistToggle = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    if (watchlistSymbols.has(symbol)) {
      removeFromWatchlist.mutate(symbol);
    } else {
      addToWatchlist.mutate(symbol);
    }
  };

  const tabSizes = useMemo(
    () => ({
      AI: filteredAiSymbols.length,
      WATCHLIST: filteredWatchlistSymbols.length,
      VN30: isMarketTab ? marketTotal : 30,
    }),
    [
      filteredAiSymbols.length,
      filteredWatchlistSymbols.length,
      isMarketTab,
      marketTotal,
    ],
  );

  return {
    activeTab,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    currentPage,
    setCurrentPage,
    watchlistSymbols,
    trainedSymbols,
    totalItems,
    totalPages,
    isMarketTab,
    boardRows,
    isLoading,
    handleTabChange,
    handleWatchlistToggle,
    addToWatchlist,
    removeFromWatchlist,
    t,
    tabSizes,
  };
}
export type BoardRowDataType = ReturnType<
  typeof useStockBoard
>["boardRows"][number];
export type WatchlistMutationType =
  | ReturnType<typeof useStockBoard>["addToWatchlist"]
  | ReturnType<typeof useStockBoard>["removeFromWatchlist"];
export type WatchlistSymbolsSetType = ReturnType<
  typeof useStockBoard
>["watchlistSymbols"];
export type TrainedSymbolsListType = ReturnType<
  typeof useStockBoard
>["trainedSymbols"];
export type BoardTabIdType = ReturnType<typeof useStockBoard>["activeTab"];
