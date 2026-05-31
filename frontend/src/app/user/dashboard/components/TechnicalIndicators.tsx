import { Activity, BarChart3, ChevronRight, TrendingUp } from "lucide-react";
import { useMemo } from "react";

import { TechnicalIndicatorsSkeleton } from "@/app/user/dashboard/components/TechnicalIndicatorsSkeleton";
import { useQueryQuoteHistorical } from "@/queries/stocks/QueryHooksStocks";
import {
  IndicatorItem,
  IndicatorStatus,
  MarketType,
  TimePeriod,
} from "@/types/stock/stock.type";
import {
  calculateEMA,
  calculateMACD,
  calculateRSI,
  calculateSMA,
  getStatusColor,
  getStatusDot,
  getStatusText,
} from "@/utils/technicalIndicator";

interface TechnicalIndicatorsProps {
  stock: string;
}

export function TechnicalIndicators(props: TechnicalIndicatorsProps) {
  const { stock } = props;
  const { data = [], isLoading } = useQueryQuoteHistorical({
    symbol: stock,
    type: MarketType.STOCK,
    period: TimePeriod.THREE_MONTH,
  });

  const indicators = useMemo(() => {
    const prices = data.map((item) => item.close);

    if (!prices.length) {
      return [];
    }

    const latestPrice = prices[prices.length - 1];

    const ma20 = calculateSMA(prices, 20);
    const ema50 = calculateEMA(prices, 50);
    const rsi14 = calculateRSI(prices, 14);
    const macd = calculateMACD(prices);

    const result: IndicatorItem[] = [
      {
        name: "MA(20)",
        value: ma20?.toFixed(2) ?? "--",
        status:
          ma20 === null
            ? IndicatorStatus.NEUTRAL
            : latestPrice > ma20
              ? IndicatorStatus.BULLISH
              : IndicatorStatus.BEARISH,
        icon: TrendingUp,
        description: "Moving Average",
      },
      {
        name: "EMA(50)",
        value: ema50?.toFixed(2) ?? "--",
        status:
          ema50 === null
            ? IndicatorStatus.NEUTRAL
            : latestPrice > ema50
              ? IndicatorStatus.BULLISH
              : IndicatorStatus.BEARISH,
        icon: TrendingUp,
        description: "Exponential MA",
      },
      {
        name: "RSI(14)",
        value: rsi14?.toFixed(2) ?? "--",
        status:
          rsi14 === null
            ? IndicatorStatus.NEUTRAL
            : rsi14 > 70
              ? IndicatorStatus.BEARISH
              : rsi14 < 30
                ? IndicatorStatus.BULLISH
                : IndicatorStatus.NEUTRAL,
        icon: Activity,
        description: "Relative Strength",
      },
      {
        name: "MACD",
        value: macd?.toFixed(2) ?? "--",
        status:
          macd === null
            ? IndicatorStatus.NEUTRAL
            : macd > 0
              ? IndicatorStatus.BULLISH
              : IndicatorStatus.BEARISH,
        icon: BarChart3,
        description: "Momentum",
      },
    ];

    return result;
  }, [data]);

  const bullishCount = indicators.filter(
    (item) => item.status === IndicatorStatus.BULLISH,
  ).length;

  const neutralCount = indicators.filter(
    (item) => item.status === IndicatorStatus.NEUTRAL,
  ).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-brand-900 text-2xl">Chỉ báo kỹ thuật - {stock}</h2>

        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      {isLoading ? (
        <TechnicalIndicatorsSkeleton />
      ) : (
        <>
          <div className="space-y-3">
            {indicators.map((indicator) => {
              const Icon = indicator.icon;

              return (
                <div
                  key={indicator.name}
                  className="rounded-xl border-2 border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-gray-100 p-2">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span>{indicator.name}</span>

                          <span
                            className={`h-2 w-2 rounded-full ${getStatusDot(
                              indicator.status,
                            )}`}
                          />
                        </div>

                        <div className="text-xs text-gray-500">
                          {indicator.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div>{indicator.value}</div>

                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(
                          indicator.status,
                        )}`}
                      >
                        {getStatusText(indicator.status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-xs">
            <p>
              <strong>Tín hiệu kỹ thuật:</strong> {bullishCount} bullish,{" "}
              {neutralCount} neutral
            </p>

            <p className="mt-1 text-gray-500">
              Các chỉ báo được cập nhật từ dữ liệu lịch sử
            </p>
          </div>
        </>
      )}
    </div>
  );
}
