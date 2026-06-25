"use client";

import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

import type { WatchlistFilter, WatchlistSort } from "../page";
import { WatchlistAddStock } from "./WatchlistAddStock";
import { WatchlistCategoryTabs } from "./WatchlistCategoryTabs";

type WatchlistHeaderProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  activeFilter: WatchlistFilter;
  onFilterChange: (value: WatchlistFilter) => void;
  activeSort: WatchlistSort;
  onSortChange: (value: WatchlistSort) => void;
  visibleCount: number;
  totalCount: number;

  // Category-related props
  watchlistCategories: string[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  onCreateCategory: (name: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
  onAddStockToCategory: (symbol: string) => void;
  onAddStockToCategories: (symbol: string, categories: string[]) => void;
};

export function WatchlistHeader(props: WatchlistHeaderProps) {
  const {
    searchTerm,
    onSearchTermChange,
    activeFilter,
    onFilterChange,
    activeSort,
    onSortChange,
    visibleCount,
    totalCount,
    watchlistCategories,
    selectedCategory,
    onSelectCategory,
    onCreateCategory,
    onRenameCategory,
    onDeleteCategory,
    onAddStockToCategory,
    onAddStockToCategories,
  } = props;
  const { t } = useLanguage();

  const filterOptions: { label: string; value: WatchlistFilter }[] = [
    { label: t("watchlist.filterAll"), value: "all" },
    { label: t("watchlist.filterPriceUp"), value: "up" },
    { label: t("watchlist.filterPriceDown"), value: "down" },
    { label: t("watchlist.filterHeld"), value: "held" },
  ];

  const sortOptions: { label: string; value: WatchlistSort }[] = [
    { label: t("watchlist.sortSymbol"), value: "symbol" },
    { label: t("watchlist.sortPriceDesc"), value: "price-desc" },
    { label: t("watchlist.sortChangeDesc"), value: "change-desc" },
    { label: t("watchlist.sortVolumeDesc"), value: "volume-desc" },
    { label: t("watchlist.sortPositionDesc"), value: "position-desc" },
  ];

  return (
    <div className="space-y-4">
      {/* Title & Info Section */}
      <div
        className={cn(
          "flex flex-col gap-4",
          "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div>
          <h1 className={cn("mb-2 text-3xl font-bold", "text-foreground")}>
            {t("watchlist.title")}
          </h1>

          <p className="text-muted-foreground">{t("watchlist.subtitle")}</p>

          <p className="text-muted-foreground mt-2 text-sm">
            {t("watchlist.filteredCount", {
              visible: visibleCount,
              total: totalCount,
            })}
          </p>
        </div>
      </div>

      {/* Watchlist Categories Tabs */}
      <WatchlistCategoryTabs
        watchlistCategories={watchlistCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onCreateCategory={onCreateCategory}
        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}
      />

      {/* Control row: Add stock, search term, filters & sorting */}
      <div className="flex w-full flex-col gap-4 pt-2 lg:flex-row lg:items-end lg:justify-between">
        {/* Autocomplete Search & Add Stock */}
        <WatchlistAddStock
          onAddStockToCategory={onAddStockToCategory}
          onAddStockToCategories={onAddStockToCategories}
          watchlistCategories={watchlistCategories}
          selectedCategory={selectedCategory}
        />

        {/* Search, Filter, Sort Controls Group */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
          <div className="flex w-full flex-col gap-1 sm:w-64">
            <span className="text-muted-foreground invisible text-xs font-semibold sm:visible">
              &nbsp;
            </span>
            <InputSearch
              placeholder={t("watchlist.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              classNameWrapper="w-full"
            />
          </div>

          <label className="text-muted-foreground flex w-full flex-col gap-1 text-xs font-semibold sm:w-auto">
            {t("watchlist.filterLabel")}
            <select
              value={activeFilter}
              onChange={(event) =>
                onFilterChange(event.target.value as WatchlistFilter)
              }
              className="border-input bg-card text-foreground focus:border-accent-500 h-12 min-w-40 cursor-pointer rounded-lg border-2 px-3 text-sm font-medium transition-colors outline-none"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-muted-foreground flex w-full flex-col gap-1 text-xs font-semibold sm:w-auto">
            {t("watchlist.sortLabel")}
            <select
              value={activeSort}
              onChange={(event) =>
                onSortChange(event.target.value as WatchlistSort)
              }
              className="border-input bg-card text-foreground focus:border-accent-500 h-12 min-w-48 cursor-pointer rounded-lg border-2 px-3 text-sm font-medium transition-colors outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
