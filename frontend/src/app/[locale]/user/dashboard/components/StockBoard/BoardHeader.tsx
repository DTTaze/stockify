import { Search, Sparkles } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/providers/LanguageProvider";

import { BOARD_TABS } from "./useStockBoard";

interface BoardHeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTabChange: (tabId: string) => void;
}

export function BoardHeader({
  activeTab,
  searchQuery,
  setSearchQuery,
  handleTabChange,
}: BoardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-55/80 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex flex-wrap gap-1">
        {BOARD_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              variant={isActive ? "default" : "ghost"}
              size="xs"
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow shadow-indigo-600/30"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab.id === "AI" ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  {t(tab.translationKey)}
                </span>
              ) : (
                t(tab.translationKey)
              )}
            </Button>
          );
        })}
      </div>

      {/* Board Search */}
      <div className="relative w-full max-w-xs sm:w-60">
        <Search className="dark:text-slate-505 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-gray-850 dark:placeholder-slate-550 h-8 w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-8 pl-9 text-xs placeholder-gray-400 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setSearchQuery("")}
            className="hover:text-gray-650 dark:hover:text-slate-305 absolute top-1/2 right-2.5 -translate-y-1/2 text-sm font-bold text-gray-400 dark:text-slate-500"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}
