/* eslint-disable max-lines */
import { useQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import { getStockQuoteQueryFn } from "@/queries/stocks/QueryFnsStocks";
import {
  useQueryIcbIndustries,
  useQueryIcbStocks,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import {
  useAddToWatchlist,
  useQueryWatchlist,
  useRemoveFromWatchlist,
} from "@/queries/watchlist/QueryHooksWatchlist";
import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";

import { ITEMS_PER_PAGE } from "../constants";

export function useStockBoard() {
  const [activeTab, setActiveTab] = useState<string>("AI");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  // Watchlist categories states
  const [watchlistCategories, setWatchlistCategories] = useState<string[]>([
    "Danh mục của tôi",
  ]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Danh mục của tôi");
  const [categoryMappings, setCategoryMappings] = useState<
    Record<string, string[]>
  >({
    "Danh mục của tôi": [],
  });

  // VN30 sub-indices states
  const [selectedVn30SubIndex, setSelectedVn30SubIndex] =
    useState<string>("VN30");

  // ICB industries states
  const [selectedIcbCode, setSelectedIcbCode] = useState<string>("");
  const { data: icbIndustriesData = [] } = useQueryIcbIndustries();

  const selectedIcbIndustryName = useMemo(() => {
    const found = icbIndustriesData.find((ind) => ind.code === selectedIcbCode);
    return found ? found.name : undefined;
  }, [icbIndustriesData, selectedIcbCode]);

  useEffect(() => {
    if (icbIndustriesData.length > 0 && !selectedIcbCode) {
      const defaultInd =
        icbIndustriesData.find((ind) => ind.stockCount > 0) ||
        icbIndustriesData[0];
      if (defaultInd) {
        setSelectedIcbCode(defaultInd.code);
      }
    }
  }, [icbIndustriesData, selectedIcbCode]);

  useEffect(() => {
    const savedCategories = localStorage.getItem(
      "stockify_watchlist_categories",
    );
    const savedSelected = localStorage.getItem(
      "stockify_selected_watchlist_category",
    );
    const savedMappings = localStorage.getItem("stockify_category_symbols");

    if (savedCategories) {
      setWatchlistCategories(JSON.parse(savedCategories));
    }
    if (savedSelected) {
      setSelectedCategory(savedSelected);
    }
    if (savedMappings) {
      setCategoryMappings(JSON.parse(savedMappings));
    }
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    localStorage.setItem("stockify_selected_watchlist_category", categoryName);
  };

  const handleCreateCategory = (categoryName: string) => {
    const name = categoryName.trim();
    if (!name) {
      return;
    }
    if (!watchlistCategories.includes(name)) {
      const updatedCats = [...watchlistCategories, name];
      setWatchlistCategories(updatedCats);
      localStorage.setItem(
        "stockify_watchlist_categories",
        JSON.stringify(updatedCats),
      );

      const updatedMappings = { ...categoryMappings, [name]: [] };
      setCategoryMappings(updatedMappings);
      localStorage.setItem(
        "stockify_category_symbols",
        JSON.stringify(updatedMappings),
      );
    }
    handleSelectCategory(name);
  };

  const handleSelectVn30SubIndex = (subIndex: string) => {
    setSelectedVn30SubIndex(subIndex);
    handleTabChange("VN30");
  };

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
  const isMarketTab = ["VN30", "HNX30", "HOSE", "HNX"].includes(activeTab);
  const isCpNganhTab = activeTab === "CP_NGANH";

  const queryGroup = useMemo(() => {
    if (activeTab === "HNX30") {
      return "HNX30";
    }
    if (activeTab === "VN30") {
      return selectedVn30SubIndex;
    }
    return activeTab;
  }, [activeTab, selectedVn30SubIndex]);

  const { data: marketData, isLoading: isMarketLoading } = useQueryStocks(
    isMarketTab
      ? {
          group: queryGroup,
          keyword: searchQuery.trim() || undefined,
          limit: ITEMS_PER_PAGE,
          offset: marketOffset,
        }
      : undefined,
  );

  const { data: icbStocksData, isLoading: isIcbStocksLoading } =
    useQueryIcbStocks(
      isCpNganhTab ? selectedIcbCode : "",
      isCpNganhTab
        ? {
            keyword: searchQuery.trim() || undefined,
            limit: ITEMS_PER_PAGE,
            offset: marketOffset,
          }
        : undefined,
    );

  const marketStocks = useMemo(() => {
    if (activeTab === "CP_NGANH") {
      return icbStocksData?.rows ?? [];
    }
    return marketData?.rows ?? [];
  }, [activeTab, marketData, icbStocksData]);

  const marketTotal = useMemo(() => {
    if (activeTab === "CP_NGANH") {
      return icbStocksData?.total ?? 0;
    }
    return marketData?.total ?? 0;
  }, [activeTab, marketData, icbStocksData]);

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
      const activeCatSymbols = categoryMappings[selectedCategory] || [];
      let symbolsToRender = activeCatSymbols;
      if (
        selectedCategory === "Danh mục của tôi" &&
        activeCatSymbols.length === 0 &&
        watchlistQuotes.length > 0
      ) {
        symbolsToRender = watchlistQuotes.map((q) => q.symbol);
      }

      const filtered = watchlistQuotes.filter((w) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          w.symbol.toLowerCase().includes(q) ||
          w.name.toLowerCase().includes(q);
        return matchesQuery && symbolsToRender.includes(w.symbol);
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
    categoryMappings,
    selectedCategory,
  ]);

  const isLoading =
    activeTab === "AI"
      ? isModelsLoading || isQuotesLoading
      : activeTab === "WATCHLIST"
        ? isWatchlistLoading
        : activeTab === "CP_NGANH"
          ? isIcbStocksLoading || isQuotesLoading
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
      const updatedMappings = { ...categoryMappings };
      for (const cat in updatedMappings) {
        updatedMappings[cat] = (updatedMappings[cat] || []).filter(
          (s) => s !== symbol,
        );
      }
      setCategoryMappings(updatedMappings);
      localStorage.setItem(
        "stockify_category_symbols",
        JSON.stringify(updatedMappings),
      );
    } else {
      addToWatchlist.mutate(symbol);
      const updatedMappings = { ...categoryMappings };
      if (!updatedMappings[selectedCategory]) {
        updatedMappings[selectedCategory] = [];
      }
      if (!updatedMappings[selectedCategory].includes(symbol)) {
        updatedMappings[selectedCategory].push(symbol);
      }
      setCategoryMappings(updatedMappings);
      localStorage.setItem(
        "stockify_category_symbols",
        JSON.stringify(updatedMappings),
      );
    }
  };

  const tabSizes = useMemo(
    () => ({
      AI: filteredAiSymbols.length,
      WATCHLIST: filteredWatchlistSymbols.length,
      VN30: activeTab === "VN30" ? marketTotal : 30,
      HNX30: activeTab === "HNX30" ? marketTotal : 30,
      HOSE: activeTab === "HOSE" ? marketTotal : 150,
      HNX: activeTab === "HNX" ? marketTotal : 100,
      CP_NGANH: activeTab === "CP_NGANH" ? marketTotal : 100,
    }),
    [
      filteredAiSymbols.length,
      filteredWatchlistSymbols.length,
      activeTab,
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
    watchlistCategories,
    selectedCategory,
    handleSelectCategory,
    handleCreateCategory,
    selectedVn30SubIndex,
    setSelectedVn30SubIndex: handleSelectVn30SubIndex,
    selectedIcbCode,
    setSelectedIcbCode,
    selectedIcbIndustryName,
    icbIndustries: icbIndustriesData,
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
