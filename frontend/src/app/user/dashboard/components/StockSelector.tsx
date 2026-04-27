import { Activity, Search, TrendingDown, TrendingUp } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
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
        <div className="relative w-72">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {stockCompanies.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.organizationName}
              </option>
            ))}
          </select>
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
