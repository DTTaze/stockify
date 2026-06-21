"use client";

import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

type WatchlistHeaderProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export function WatchlistHeader(props: WatchlistHeaderProps) {
  const { searchTerm, onSearchTermChange } = props;
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div>
        <h1 className={cn("mb-2 text-3xl", "text-brand-900")}>
          {t("watchlist.title")}
        </h1>

        <p className="text-gray-600">{t("watchlist.subtitle")}</p>
      </div>

      <div className={cn("flex items-center", "space-x-3")}>
        <InputSearch
          placeholder={t("watchlist.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          classNameWrapper="w-64"
        />
      </div>
    </div>
  );
}
