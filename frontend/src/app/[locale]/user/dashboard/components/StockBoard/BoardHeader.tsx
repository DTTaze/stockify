import { ChevronDown, Search } from "lucide-react";
import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";

import { BOARD_TABS } from "./constants";

interface BoardHeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTabChange: (tabId: string) => void;
  selectedCategory: string;
  onToggleWatchlistDropdown: () => void;
  selectedVn30SubIndex: string;
  onToggleVn30Dropdown: () => void;
  selectedIcbIndustryName?: string;
  onToggleCpNganhDropdown?: () => void;
}

export function BoardHeader({
  activeTab,
  searchQuery,
  setSearchQuery,
  handleTabChange,
  selectedCategory,
  onToggleWatchlistDropdown,
  selectedVn30SubIndex,
  onToggleVn30Dropdown,
  selectedIcbIndustryName,
  onToggleCpNganhDropdown,
}: BoardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="no-scrollbar flex items-center gap-5 overflow-x-auto border-b border-gray-200 bg-gray-50/50 px-4 py-1.5 select-none dark:border-slate-800 dark:bg-[#161720]">
      {/* Board Search */}
      <div className="relative w-44 flex-shrink-0">
        <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
        <input
          type="text"
          placeholder={t("searchSimplePlaceholder", { title: "CK" })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-7 w-full rounded-md border border-gray-300 bg-gray-200/50 py-1 pr-6 pl-8 text-xs text-slate-800 placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500/80 dark:border-none dark:text-white dark:placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="hover:text-slate-850 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-sm font-bold text-slate-500 dark:text-slate-400 dark:hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Board Tabs */}
      <div className="flex flex-1 items-center gap-5 py-0.5">
        {BOARD_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "WATCHLIST") {
                  onToggleWatchlistDropdown();
                } else if (tab.id === "VN30") {
                  onToggleVn30Dropdown();
                } else if (tab.id === "CP_NGANH") {
                  onToggleCpNganhDropdown?.();
                } else {
                  handleTabChange(tab.id);
                }
              }}
              className={`group relative -mb-[7px] flex cursor-pointer items-center gap-1 border-b-2 py-1 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "border-blue-600 font-bold text-blue-600 dark:border-white dark:text-white"
                  : "hover:text-slate-850 border-transparent text-slate-600 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>
                {tab.id === "WATCHLIST"
                  ? selectedCategory
                  : tab.id === "VN30"
                    ? selectedVn30SubIndex
                    : tab.id === "CP_NGANH" && selectedIcbIndustryName
                      ? selectedIcbIndustryName
                      : t(tab.translationKey)}
              </span>
              {tab.hasChevron && (
                <ChevronDown
                  className={`h-3 w-3 transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-white"
                      : "group-hover:text-slate-850 text-slate-500 dark:text-slate-400 dark:group-hover:text-white"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
