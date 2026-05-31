import {
  Activity,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import {
  useQueryIndexQuote,
  useQueryStockCompanies,
} from "@/queries/stocks/QueryHooksStocks";
import { MarketType, TimePeriod } from "@/types/stock/stock.type";
import { formatPrice } from "@/utils/string";

const TIME_RANGE_MAP: Record<string, TimePeriod> = {
  "1D": TimePeriod.ONE_DAY,
  "1W": TimePeriod.ONE_WEEK,
  "1M": TimePeriod.ONE_MONTH,
  "3M": TimePeriod.THREE_MONTH,
  "6M": TimePeriod.SIX_MONTH,
  "1Y": TimePeriod.ONE_YEAR,
};

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
  period: TimePeriod;
  onChangePeriod: (p: TimePeriod) => void;
}

export function StockSelector(props: StockSelectorProps) {
  const { value, onChange, period, onChangePeriod } = props;
  const { data: stockCompanies = [] } = useQueryStockCompanies();
  const { data: models = [] } = useGetModels();

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trainedSymbols = useMemo(
    () => new Set(models.map((m) => m.id)),
    [models],
  );

  const currentCompany = useMemo(() => {
    return stockCompanies.find((c) => c.symbol === value);
  }, [stockCompanies, value]);

  useEffect(() => {
    if (currentCompany) {
      setSearchQuery(
        `${currentCompany.symbol} - ${currentCompany.organizationName}`,
      );
    } else if (value) {
      setSearchQuery(value);
    }
  }, [currentCompany, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (currentCompany) {
          setSearchQuery(
            `${currentCompany.symbol} - ${currentCompany.organizationName}`,
          );
        } else {
          setSearchQuery(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentCompany, value]);

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return stockCompanies;
    }
    if (
      currentCompany &&
      q ===
        `${currentCompany.symbol} - ${currentCompany.organizationName}`.toLowerCase()
    ) {
      return stockCompanies;
    }
    return stockCompanies.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) ||
        c.organizationName.toLowerCase().includes(q),
    );
  }, [stockCompanies, searchQuery, currentCompany]);

  const { data } = useQueryIndexQuote({
    symbol: value,
    type: MarketType.STOCK,
    period: period,
  });

  const currentPrice = data?.price ?? 0;
  const priceChange = data?.change_percent ?? 0;
  const volume = data?.volume ?? 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {/* Search Combobox */}
        <div className="relative w-80" ref={containerRef}>
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Tìm mã hoặc tên công ty..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsOpen(true);
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}

          {isOpen && filteredCompanies.length > 0 && (
            <div className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {filteredCompanies.map((stock) => {
                const hasAI = trainedSymbols.has(stock.symbol);
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onChange(stock.symbol);
                      setSearchQuery(
                        `${stock.symbol} - ${stock.organizationName}`,
                      );
                      setIsOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      value === stock.symbol
                        ? "bg-indigo-50 font-semibold text-indigo-900"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="truncate">
                      {stock.symbol} - {stock.organizationName}
                    </span>
                    {hasAI && (
                      <span className="ml-2 flex items-center space-x-0.5 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 shadow-xs">
                        <Sparkles className="h-3 w-3 animate-pulse text-purple-600" />
                        <span>AI</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-brand-900 text-4xl font-semibold">
            {formatPrice(currentPrice)}
          </div>

          <div
            className={`flex items-center space-x-1 text-lg ${
              priceChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {priceChange >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span>
              {priceChange >= 0 ? "+" : ""}
              {priceChange}%
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Activity className="h-4 w-4" />
          <span>Vol: {volume.toLocaleString("vi-VN")}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(TIME_RANGE_MAP).map(([label, valuePeriod]) => (
          <ButtonCustom
            key={label}
            onClick={() => onChangePeriod(valuePeriod)}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              period === valuePeriod
                ? "bg-brand-900 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </ButtonCustom>
        ))}
      </div>
    </div>
  );
}
