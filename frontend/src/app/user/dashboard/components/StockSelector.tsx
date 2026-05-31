/* eslint-disable max-lines */
"use client";

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
  useQueryStockCompanies,
  useQueryStockQuote,
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

const TRAINED_STOCKS_MAP: Record<string, string> = {
  BID: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
  CTG: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
  FPT: "Công ty Cổ phần FPT",
  HPG: "Công ty Cổ phần Tập đoàn Hòa Phát",
  SSI: "Công ty Cổ phần Chứng khoán SSI",
  TCB: "Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)",
  VCB: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
  VHM: "Công ty Cổ phần Vinhomes",
  VIC: "Tập đoàn Vingroup - CTCP",
  VNM: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
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

  const allSearchableCompanies = useMemo(() => {
    const companyMap = new Map<string, string>(
      Object.entries(TRAINED_STOCKS_MAP),
    );

    // Add dynamically fetched companies, overriding names if necessary
    stockCompanies.forEach((c) => {
      companyMap.set(c.symbol, c.organizationName);
    });

    // Add any other models fetched that might not be in our pre-defined map
    models.forEach((m) => {
      if (!companyMap.has(m.id)) {
        companyMap.set(m.id, `${m.id} LSTM Predictor`);
      }
    });

    return Array.from(companyMap.entries()).map(
      ([symbol, organizationName]) => ({
        symbol,
        organizationName,
      }),
    );
  }, [stockCompanies, models]);

  const currentCompany = useMemo(() => {
    return allSearchableCompanies.find((c) => c.symbol === value);
  }, [allSearchableCompanies, value]);

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

  const groupedFilteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list = allSearchableCompanies;
    if (
      q &&
      (!currentCompany ||
        q !==
          `${currentCompany.symbol} - ${currentCompany.organizationName}`.toLowerCase())
    ) {
      list = allSearchableCompanies.filter(
        (c) =>
          c.symbol.toLowerCase().includes(q) ||
          c.organizationName.toLowerCase().includes(q),
      );
    } else {
      // Default to returning recommended trained stocks when query is empty
      list = allSearchableCompanies.filter((c) => trainedSymbols.has(c.symbol));
    }

    const trained = list.filter((c) => trainedSymbols.has(c.symbol));
    const normal = list.filter((c) => !trainedSymbols.has(c.symbol));

    return {
      trained,
      normal,
      total: trained.length + normal.length,
    };
  }, [allSearchableCompanies, searchQuery, currentCompany, trainedSymbols]);

  const { data } = useQueryStockQuote({
    symbol: value,
    type: MarketType.STOCK,
    period: period,
  });

  const currentPrice = data?.price ?? 0;
  const priceChange = data?.change_percent ?? 0;
  const volume = data?.volume ?? 0;

  return (
    <div className="flex flex-col justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
      <div className="min-w-0 flex-1 space-y-4">
        {/* Search Combobox */}
        <div className="relative w-full max-w-md" ref={containerRef}>
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
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer font-bold text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}

          {isOpen && groupedFilteredCompanies.total > 0 && (
            <div className="no-scrollbar absolute right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
              {/* AI Stocks Section */}
              {groupedFilteredCompanies.trained.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 bg-purple-50/50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-purple-600 uppercase">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    Cổ phiếu phân tích bởi AI (Khuyên dùng)
                  </div>
                  {groupedFilteredCompanies.trained.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        onChange(stock.symbol);
                        setSearchQuery(
                          `${stock.symbol} - ${stock.organizationName}`,
                        );
                        setIsOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-purple-50 ${
                        value === stock.symbol
                          ? "bg-purple-100/70 font-semibold text-purple-950"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-xs font-bold text-purple-700">
                          {stock.symbol}
                        </span>
                        <span className="truncate text-gray-800">
                          {stock.organizationName}
                        </span>
                      </div>
                      <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 shadow-xs">
                        <Sparkles className="h-2.5 w-2.5 text-purple-600" />
                        <span>AI</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Normal Stocks Section */}
              {groupedFilteredCompanies.normal.length > 0 && (
                <div
                  className={
                    groupedFilteredCompanies.trained.length > 0
                      ? "border-t border-gray-100"
                      : ""
                  }
                >
                  <div className="bg-gray-50/50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Mã cổ phiếu khác (Chỉ xem giá)
                  </div>
                  {groupedFilteredCompanies.normal.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        onChange(stock.symbol);
                        setSearchQuery(
                          `${stock.symbol} - ${stock.organizationName}`,
                        );
                        setIsOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                        value === stock.symbol
                          ? "bg-indigo-50 font-semibold text-indigo-900"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-bold text-gray-600">
                          {stock.symbol}
                        </span>
                        <span className="truncate text-gray-600">
                          {stock.organizationName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Select Badges */}
        {models.length > 0 && (
          <div className="flex w-full flex-col gap-1.5">
            <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              <Sparkles className="h-3 w-3 animate-pulse text-purple-500" />
              Cổ phiếu đã train ({models.length}):
            </span>
            <div className="no-scrollbar -mx-1 flex max-w-full flex-row gap-1.5 overflow-x-auto px-1 pb-2 whitespace-nowrap">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onChange(model.id);
                    const company = allSearchableCompanies.find(
                      (c) => c.symbol === model.id,
                    );
                    if (company) {
                      setSearchQuery(
                        `${company.symbol} - ${company.organizationName}`,
                      );
                    } else {
                      setSearchQuery(model.id);
                    }
                  }}
                  className={`inline-flex shrink-0 cursor-pointer rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    value === model.id
                      ? "scale-105 bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:scale-102 hover:bg-gray-200"
                  }`}
                >
                  {model.id}
                </button>
              ))}
            </div>
          </div>
        )}

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
