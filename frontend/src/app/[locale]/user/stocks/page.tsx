"use client";

import { Layers } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import {
  useQueryFutures,
  useQueryGovernmentBonds,
  useQueryIcbIndustries,
  useQueryIcbStocks,
  useQueryIndices,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

import { UserIcbClassificationTable } from "./components/UserIcbClassificationTable";
import { UserMarketClassificationTable } from "./components/UserMarketClassificationTable";
import { UserSimpleSymbolsTable } from "./components/UserSimpleSymbolsTable";

const ITEMS_PER_PAGE = 15;

type ClassificationType = "market" | "icb" | "futures" | "bonds" | "indices";

export default function UserStocksPage() {
  const { t } = useLanguage();
  const [classificationType, setClassificationType] =
    useState<ClassificationType>("market");

  // Market classification states
  const [activeMarketTab, setActiveMarketTab] = useState("HOSE");
  const [marketSearch, setMarketSearch] = useState("");
  const [marketPage, setMarketPage] = useState(1);

  // ICB classification states
  const [activeIcbCode, setActiveIcbCode] = useState<string>("");
  const [icbSearch, setIcbSearch] = useState("");
  const [icbPage, setIcbPage] = useState(1);

  // Fetch all levels of ICB industries
  const { data: icbIndustriesData, isLoading: isIcbIndustriesLoading } =
    useQueryIcbIndustries();
  const icbIndustries = useMemo(
    () => icbIndustriesData ?? [],
    [icbIndustriesData],
  );

  // Set default ICB industry when loaded
  useEffect(() => {
    if (icbIndustries.length > 0 && !activeIcbCode) {
      setActiveIcbCode(icbIndustries[0].code);
    }
  }, [icbIndustries, activeIcbCode]);

  // Market Stocks query
  const marketOffset = (marketPage - 1) * ITEMS_PER_PAGE;
  const { data: marketData, isLoading: isMarketLoading } = useQueryStocks({
    group: activeMarketTab,
    keyword: marketSearch.trim() || undefined,
    limit: ITEMS_PER_PAGE,
    offset: marketOffset,
  });

  const marketStocks = marketData?.rows ?? [];
  const marketTotal = marketData?.total ?? 0;
  const marketTotalPages = Math.ceil(marketTotal / ITEMS_PER_PAGE) || 1;

  // ICB Stocks query
  const icbOffset = (icbPage - 1) * ITEMS_PER_PAGE;
  const { data: icbData, isLoading: isIcbLoading } = useQueryIcbStocks(
    activeIcbCode,
    {
      keyword: icbSearch.trim() || undefined,
      limit: ITEMS_PER_PAGE,
      offset: icbOffset,
    },
  );

  const icbStocks = icbData?.rows ?? [];
  const icbTotal = icbData?.total ?? 0;
  const icbTotalPages = Math.ceil(icbTotal / ITEMS_PER_PAGE) || 1;

  // Futures, Bonds, and Indices Queries
  const { data: futuresData, isLoading: isFuturesLoading } = useQueryFutures();
  const { data: bondsData, isLoading: isBondsLoading } =
    useQueryGovernmentBonds();
  const { data: indicesListData, isLoading: isIndicesListLoading } =
    useQueryIndices();

  const futuresSymbols = futuresData ?? [];
  const bondsSymbols = bondsData ?? [];
  const indicesSymbols = indicesListData ?? [];

  const handleMarketTabChange = (tabId: string) => {
    setActiveMarketTab(tabId);
    setMarketPage(1);
  };

  const handleIcbTabChange = (code: string) => {
    setActiveIcbCode(code);
    setIcbPage(1);
  };

  const handleMarketSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarketSearch(e.target.value);
    setMarketPage(1);
  };

  const handleIcbSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcbSearch(e.target.value);
    setIcbPage(1);
  };

  const renderActiveTable = () => {
    switch (classificationType) {
      case "market":
        return (
          <UserMarketClassificationTable
            activeMarketTab={activeMarketTab}
            marketSearch={marketSearch}
            marketPage={marketPage}
            marketStocks={marketStocks}
            marketTotal={marketTotal}
            marketTotalPages={marketTotalPages}
            isMarketLoading={isMarketLoading}
            onMarketTabChange={handleMarketTabChange}
            onMarketSearch={handleMarketSearch}
            onMarketPageChange={setMarketPage}
          />
        );
      case "icb":
        return (
          <UserIcbClassificationTable
            icbIndustries={icbIndustries}
            activeIcbCode={activeIcbCode}
            icbSearch={icbSearch}
            icbPage={icbPage}
            icbStocks={icbStocks}
            icbTotal={icbTotal}
            icbTotalPages={icbTotalPages}
            isIcbLoading={isIcbLoading}
            isIcbIndustriesLoading={isIcbIndustriesLoading}
            onIcbTabChange={handleIcbTabChange}
            onIcbSearch={handleIcbSearch}
            onIcbPageChange={setIcbPage}
          />
        );
      case "futures":
        return (
          <UserSimpleSymbolsTable
            symbols={futuresSymbols}
            type="futures"
            isLoading={isFuturesLoading}
          />
        );
      case "bonds":
        return (
          <UserSimpleSymbolsTable
            symbols={bondsSymbols}
            type="bonds"
            isLoading={isBondsLoading}
          />
        );
      case "indices":
        return (
          <UserSimpleSymbolsTable
            symbols={indicesSymbols}
            type="indices"
            isLoading={isIndicesListLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <Layers className="text-brand-900 h-6 w-6" />
            {t("stocks.title")}
          </h1>
          <p className="text-sm text-gray-500">{t("stocks.subtitle")}</p>
        </div>
      </div>

      {/* Main Switcher (Market vs ICB vs Futures vs Bonds vs Indices) */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: "market", label: t("stocks.marketTab") },
          { id: "icb", label: t("stocks.icbTab") },
          { id: "futures", label: t("stocks.futuresTab") },
          { id: "bonds", label: t("stocks.bondsTab") },
          { id: "indices", label: t("stocks.indicesTab") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setClassificationType(tab.id as ClassificationType)}
            className={cn(
              "cursor-pointer border-b-2 px-4 pb-3 text-sm font-semibold whitespace-nowrap transition-all",
              classificationType === tab.id
                ? "border-brand-900 text-brand-900"
                : "border-transparent text-gray-500 hover:text-gray-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderActiveTable()}
    </div>
  );
}
