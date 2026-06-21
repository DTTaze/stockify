import { useEffect, useMemo, useState } from "react";

import {
  useQueryClassificationSummary,
  useQueryIcbIndustries,
  useQueryIcbStocks,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import { cn } from "@/utils";

import { DataClassificationStats } from "./DataClassificationStats";
import { DataClassificationTable } from "./DataClassificationTable";
import { DataIcbClassificationTable } from "./DataIcbClassificationTable";

export function ClassificationDataSection() {
  const [classificationSubTab, setClassificationSubTab] = useState<
    "market" | "icb"
  >("market");

  // Market Classification states
  const [classificationSearch, setClassificationSearch] = useState("");
  const [classificationPage, setClassificationPage] = useState(1);
  const [classificationGroup, setClassificationGroup] = useState("HOSE");
  const [classificationLimit, setClassificationLimit] = useState(10);

  // ICB Classification states
  const [icbSearch, setIcbSearch] = useState("");
  const [icbPage, setIcbPage] = useState(1);
  const [activeIcbCode, setActiveIcbCode] = useState("");
  const [icbLimit, setIcbLimit] = useState(10);

  // Classification Queries & Mutations
  const classificationSummaryQuery = useQueryClassificationSummary();
  const offset = (classificationPage - 1) * classificationLimit;
  const classificationStocksQuery = useQueryStocks({
    group: classificationGroup,
    keyword: classificationSearch.trim() || undefined,
    limit: classificationLimit,
    offset: offset,
  });

  // ICB Classification Queries
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

  const icbOffset = (icbPage - 1) * icbLimit;
  const icbStocksQuery = useQueryIcbStocks(activeIcbCode, {
    keyword: icbSearch.trim() || undefined,
    limit: icbLimit,
    offset: icbOffset,
  });

  const classificationSummary = classificationSummaryQuery.data;
  const classificationStocks = classificationStocksQuery.data?.rows ?? [];
  const classificationTotal = classificationStocksQuery.data?.total ?? 0;
  const classificationTotalPages =
    Math.ceil(classificationTotal / classificationLimit) || 1;

  const icbStocksList = icbStocksQuery.data?.rows ?? [];
  const icbTotal = icbStocksQuery.data?.total ?? 0;
  const icbTotalPages = Math.ceil(icbTotal / icbLimit) || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassificationSearch(e.target.value);
    setClassificationPage(1);
  };

  const handleGroupChange = (group: string) => {
    setClassificationGroup(group);
    setClassificationPage(1);
  };

  const handleIcbSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcbSearch(e.target.value);
    setIcbPage(1);
  };

  const handleIcbChange = (code: string) => {
    setActiveIcbCode(code);
    setIcbPage(1);
  };

  const handleClassificationLimitChange = (newLimit: number) => {
    setClassificationLimit(newLimit);
    setClassificationPage(1);
  };

  const handleIcbLimitChange = (newLimit: number) => {
    setIcbLimit(newLimit);
    setIcbPage(1);
  };

  return (
    <>
      {/* Classification Sub-Tabs (Market Groups vs ICB Industries) */}
      <div className="flex max-w-md gap-2 rounded-xl border border-b border-gray-100 bg-gray-50/50 p-2">
        <button
          onClick={() => setClassificationSubTab("market")}
          className={cn(
            "flex-1 cursor-pointer rounded-lg px-4 py-2 text-center text-xs font-semibold transition-all duration-200",
            classificationSubTab === "market"
              ? "bg-brand-900 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          Quản lý Market Groups
        </button>
        <button
          onClick={() => setClassificationSubTab("icb")}
          className={cn(
            "flex-1 cursor-pointer rounded-lg px-4 py-2 text-center text-xs font-semibold transition-all duration-200",
            classificationSubTab === "icb"
              ? "bg-brand-900 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          Quản lý ICB Industries
        </button>
      </div>

      {classificationSubTab === "market" ? (
        <>
          {/* Classification Stats */}
          <DataClassificationStats summary={classificationSummary} />

          {/* List and search table */}
          <DataClassificationTable
            stocks={classificationStocks}
            total={classificationTotal}
            isLoading={classificationStocksQuery.isLoading}
            search={classificationSearch}
            onSearchChange={handleSearchChange}
            currentPage={classificationPage}
            totalPages={classificationTotalPages}
            onPageChange={setClassificationPage}
            activeGroup={classificationGroup}
            onGroupChange={handleGroupChange}
            limit={classificationLimit}
            onLimitChange={handleClassificationLimitChange}
          />
        </>
      ) : (
        <>
          {/* ICB List and search table */}
          <DataIcbClassificationTable
            industries={icbIndustries}
            stocks={icbStocksList}
            total={icbTotal}
            isLoading={icbStocksQuery.isLoading || isIcbIndustriesLoading}
            search={icbSearch}
            onSearchChange={handleIcbSearchChange}
            currentPage={icbPage}
            totalPages={icbTotalPages}
            onPageChange={setIcbPage}
            activeIcbCode={activeIcbCode}
            onIcbChange={handleIcbChange}
            limit={icbLimit}
            onLimitChange={handleIcbLimitChange}
          />
        </>
      )}
    </>
  );
}
