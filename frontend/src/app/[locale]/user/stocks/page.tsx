"use client";

import { BarChart3, Layers, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import {
  useQueryIcbIndustries,
  useQueryIcbStocks,
  useQueryIndices,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

import { UserIcbClassificationTable } from "./components/UserIcbClassificationTable";
import { UserIndexBasketTable } from "./components/UserIndexBasketTable";
import { UserMarketClassificationTable } from "./components/UserMarketClassificationTable";
import { UserSimpleSymbolsTable } from "./components/UserSimpleSymbolsTable";

const DEFAULT_PAGE_SIZE = 15;

type ClassificationType = "market" | "icb" | "indices";

export default function UserStocksPage() {
  const { t } = useLanguage();
  const [classificationType, setClassificationType] =
    useState<ClassificationType>("market");

  // Market classification states
  const [activeMarketTab, setActiveMarketTab] = useState("HOSE");
  const [marketSearch, setMarketSearch] = useState("");
  const [marketPage, setMarketPage] = useState(1);
  const [marketPageSize, setMarketPageSize] = useState(DEFAULT_PAGE_SIZE);

  // ICB classification states
  const [activeIcbCode, setActiveIcbCode] = useState<string>("");
  const [icbSearch, setIcbSearch] = useState("");
  const [icbPage, setIcbPage] = useState(1);
  const [icbPageSize, setIcbPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Indices classification states
  const [activeIndicesTab, setActiveIndicesTab] = useState<
    "all" | "VN30" | "HNX30"
  >("all");
  const [indicesSearch, setIndicesSearch] = useState("");
  const [indicesPage, setIndicesPage] = useState(1);
  const [indicesPageSize, setIndicesPageSize] = useState(DEFAULT_PAGE_SIZE);

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
  const marketOffset = (marketPage - 1) * marketPageSize;
  const { data: marketData, isLoading: isMarketLoading } = useQueryStocks({
    group: activeMarketTab,
    keyword: marketSearch.trim() || undefined,
    limit: marketPageSize,
    offset: marketOffset,
  });

  const marketStocks = marketData?.rows ?? [];
  const marketTotal = marketData?.total ?? 0;
  const marketTotalPages = Math.ceil(marketTotal / marketPageSize) || 1;

  // ICB Stocks query
  const icbOffset = (icbPage - 1) * icbPageSize;
  const { data: icbData, isLoading: isIcbLoading } = useQueryIcbStocks(
    activeIcbCode,
    {
      keyword: icbSearch.trim() || undefined,
      limit: icbPageSize,
      offset: icbOffset,
    },
  );

  const icbStocks = icbData?.rows ?? [];
  const icbTotal = icbData?.total ?? 0;
  const icbTotalPages = Math.ceil(icbTotal / icbPageSize) || 1;

  // Indices Query
  const { data: indicesListData, isLoading: isIndicesListLoading } =
    useQueryIndices();

  const indicesSymbols = (indicesListData ?? []).filter(
    (symbol) => symbol.toUpperCase() !== "UPCOMINDEX",
  );

  // Index Basket Stocks query
  const indicesOffset = (indicesPage - 1) * indicesPageSize;
  const { data: indicesBasketData, isLoading: isIndicesBasketLoading } =
    useQueryStocks(
      activeIndicesTab !== "all"
        ? {
            group: activeIndicesTab,
            keyword: indicesSearch.trim() || undefined,
            limit: indicesPageSize,
            offset: indicesOffset,
          }
        : undefined,
    );

  const indicesBasketStocks = indicesBasketData?.rows ?? [];
  const indicesBasketTotal = indicesBasketData?.total ?? 0;
  const indicesBasketTotalPages =
    Math.ceil(indicesBasketTotal / indicesPageSize) || 1;

  const classificationTabs: { id: ClassificationType; label: string }[] = [
    { id: "market", label: t("stocks.marketTab") },
    { id: "icb", label: t("stocks.icbTab") },
    { id: "indices", label: t("stocks.indicesTab") },
  ];

  const activeClassificationLabel =
    classificationTabs.find((tab) => tab.id === classificationType)?.label ??
    t("stocks.marketTab");

  const overviewCards = [
    {
      label: t("stocks.marketUniverse"),
      value: marketTotal.toLocaleString("vi-VN"),
      hint: activeMarketTab,
    },
    {
      label: t("stocks.icbUniverse"),
      value: icbIndustries.length.toLocaleString("vi-VN"),
      hint: t("stocks.industryGroups"),
    },
    {
      label: t("stocks.indicesUniverse"),
      value: indicesSymbols.length.toLocaleString("vi-VN"),
      hint: t("stocks.indexGroups"),
    },
  ];

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
            marketPageSize={marketPageSize}
            marketStocks={marketStocks}
            marketTotal={marketTotal}
            marketTotalPages={marketTotalPages}
            isMarketLoading={isMarketLoading}
            onMarketTabChange={handleMarketTabChange}
            onMarketSearch={handleMarketSearch}
            onMarketPageChange={setMarketPage}
            onMarketPageSizeChange={(pageSize) => {
              setMarketPageSize(pageSize);
              setMarketPage(1);
            }}
          />
        );
      case "icb":
        return (
          <UserIcbClassificationTable
            icbIndustries={icbIndustries}
            activeIcbCode={activeIcbCode}
            icbSearch={icbSearch}
            icbPage={icbPage}
            icbPageSize={icbPageSize}
            icbStocks={icbStocks}
            icbTotal={icbTotal}
            icbTotalPages={icbTotalPages}
            isIcbLoading={isIcbLoading}
            isIcbIndustriesLoading={isIcbIndustriesLoading}
            onIcbTabChange={handleIcbTabChange}
            onIcbSearch={handleIcbSearch}
            onIcbPageChange={setIcbPage}
            onIcbPageSizeChange={(pageSize) => {
              setIcbPageSize(pageSize);
              setIcbPage(1);
            }}
          />
        );
      case "indices": {
        const indicesTabs = [
          { id: "all", label: t("stocks.indicesAllTab") },
          { id: "VN30", label: t("stocks.indicesVn30Tab") },
          { id: "HNX30", label: t("stocks.indicesHnx30Tab") },
        ];

        return (
          <div className="space-y-4">
            {/* Indices Sub-tabs */}
            <div className="border-border bg-card flex flex-wrap gap-1 rounded-xl border p-2 shadow-xs">
              {indicesTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveIndicesTab(tab.id as "all" | "VN30" | "HNX30");
                    setIndicesPage(1);
                    setIndicesSearch("");
                  }}
                  className={cn(
                    "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    activeIndicesTab === tab.id
                      ? "bg-brand-900 dark:bg-brand-700 text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeIndicesTab === "all" ? (
              <UserSimpleSymbolsTable
                symbols={indicesSymbols}
                isLoading={isIndicesListLoading}
              />
            ) : (
              <UserIndexBasketTable
                basketSearch={indicesSearch}
                basketPage={indicesPage}
                basketPageSize={indicesPageSize}
                basketStocks={indicesBasketStocks}
                basketTotal={indicesBasketTotal}
                basketTotalPages={indicesBasketTotalPages}
                isBasketLoading={isIndicesBasketLoading}
                onBasketSearch={(e) => {
                  setIndicesSearch(e.target.value);
                  setIndicesPage(1);
                }}
                onBasketPageChange={setIndicesPage}
                onBasketPageSizeChange={(pageSize) => {
                  setIndicesPageSize(pageSize);
                  setIndicesPage(1);
                }}
              />
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground space-y-6 p-6">
      {/* Header */}
      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-4xl">
            <div className="border-border bg-muted/40 text-muted-foreground mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <Layers className="text-brand-700 dark:text-brand-300 h-3.5 w-3.5" />
              {t("stocks.directoryLabel")}
            </div>

            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              {t("stocks.title")}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
              {t("stocks.subtitle")}
            </p>
          </div>

          <div className="border-accent-500/30 bg-accent-500/10 text-foreground inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold">
            <Sparkles className="text-accent-500 h-4 w-4" />
            {activeClassificationLabel}
          </div>
        </div>

        <div className="border-border bg-muted/20 grid grid-cols-1 border-t md:grid-cols-3">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className="border-border flex items-center justify-between gap-4 p-4 md:border-r md:last:border-r-0"
            >
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {card.label}
                </p>
                <p className="text-foreground mt-1 text-2xl font-bold">
                  {card.value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs font-medium">
                  {card.hint}
                </p>
              </div>
              <BarChart3 className="text-muted-foreground/50 h-5 w-5 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Main Switcher (Market vs ICB vs Futures vs Bonds vs Indices) */}
      <div className="border-border bg-card flex flex-wrap gap-2 rounded-xl border p-2 shadow-sm">
        {classificationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setClassificationType(tab.id as ClassificationType)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all",
              classificationType === tab.id
                ? "bg-brand-900 dark:bg-brand-700 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
