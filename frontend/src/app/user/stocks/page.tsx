"use client";

import { Layers } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useQueryIcbIndustries,
  useQueryIcbStocks,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

import { UserIcbClassificationTable } from "./components/UserIcbClassificationTable";
import { UserMarketClassificationTable } from "./components/UserMarketClassificationTable";

const ITEMS_PER_PAGE = 15;

export default function UserStocksPage() {
  const [classificationType, setClassificationType] = useState<
    "market" | "icb"
  >("market");

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <Layers className="text-brand-900 h-6 w-6" />
            Danh mục chứng khoán
          </h1>
          <p className="text-sm text-gray-500">
            Tra cứu danh sách mã chứng khoán phân loại theo sàn giao dịch hoặc
            ngành ICB.
          </p>
        </div>
      </div>

      {/* Main Switcher (Market vs ICB) */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setClassificationType("market")}
          className={cn(
            "cursor-pointer border-b-2 px-4 pb-3 text-sm font-semibold transition-all",
            classificationType === "market"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-gray-500 hover:text-gray-900",
          )}
        >
          Phân loại thị trường
        </button>
        <button
          onClick={() => setClassificationType("icb")}
          className={cn(
            "cursor-pointer border-b-2 px-4 pb-3 text-sm font-semibold transition-all",
            classificationType === "icb"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-gray-500 hover:text-gray-900",
          )}
        >
          Phân loại ngành ICB
        </button>
      </div>

      {classificationType === "market" ? (
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
      ) : (
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
      )}
    </div>
  );
}
