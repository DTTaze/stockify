import { useMemo } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import {
  useQueryIndexHistorical,
  useQueryIndexQuote,
} from "@/queries/stocks/QueryHooksStocks";
import {
  MarketType,
  StockDataType,
  TimePeriod,
} from "@/types/stock/stock.type";

import { formatHistoryForChart, getIndexStats } from "../utils";

export function useMarketOverview() {
  const { t } = useLanguage();

  // Fetch Quotes
  const { data: vnindexQuote, isLoading: q1 } = useQueryIndexQuote({
    symbol: "vnindex",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_DAY,
  });
  const { data: vn30Quote, isLoading: q2 } = useQueryIndexQuote({
    symbol: "vn30",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_DAY,
  });
  const { data: hnxQuote, isLoading: q3 } = useQueryIndexQuote({
    symbol: "hnxindex",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_DAY,
  });
  const { data: upcomQuote, isLoading: q4 } = useQueryIndexQuote({
    symbol: "UPCOMINDEX",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_DAY,
  });

  // Fetch Histories
  const { data: vnindexHistory = [], isLoading: h1 } = useQueryIndexHistorical({
    symbol: "vnindex",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_MONTH,
  });
  const { data: vn30History = [], isLoading: h2 } = useQueryIndexHistorical({
    symbol: "vn30",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_MONTH,
  });
  const { data: hnxHistory = [], isLoading: h3 } = useQueryIndexHistorical({
    symbol: "hnxindex",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_MONTH,
  });
  const { data: upcomHistory = [], isLoading: h4 } = useQueryIndexHistorical({
    symbol: "UPCOMINDEX",
    type: MarketType.INDEX,
    period: TimePeriod.ONE_MONTH,
  });

  const isLoading = q1 || q2 || q3 || q4 || h1 || h2 || h3 || h4;

  const vnindexChart = useMemo(
    () => formatHistoryForChart(vnindexHistory, vnindexQuote?.price ?? 1200),
    [vnindexHistory, vnindexQuote],
  );
  const vn30Chart = useMemo(
    () => formatHistoryForChart(vn30History, vn30Quote?.price ?? 1250),
    [vn30History, vn30Quote],
  );
  const hnxChart = useMemo(
    () => formatHistoryForChart(hnxHistory, hnxQuote?.price ?? 240),
    [hnxHistory, hnxQuote],
  );
  const upcomChart = useMemo(
    () => formatHistoryForChart(upcomHistory, upcomQuote?.price ?? 90),
    [upcomHistory, upcomQuote],
  );

  // Derived indices
  const hnx30Quote = useMemo<StockDataType>(
    () => ({
      symbol: "HNX30",
      price: (hnxQuote?.price ?? 240) * 2.15,
      change_percent: (hnxQuote?.change_percent ?? 0) * 0.95,
      volume: Math.round((hnxQuote?.volume ?? 50_000_000) * 0.72),
    }),
    [hnxQuote],
  );

  const vnxallQuote = useMemo<StockDataType>(
    () => ({
      symbol: "VNXALL",
      price: (vnindexQuote?.price ?? 1200) * 1.61,
      change_percent: (vnindexQuote?.change_percent ?? 0) * 1.05,
      volume: Math.round((vnindexQuote?.volume ?? 500_000_000) * 1.08),
    }),
    [vnindexQuote],
  );

  const hnx35Chart = useMemo(
    () => formatHistoryForChart(hnxHistory, hnx30Quote.price),
    [hnxHistory, hnx30Quote],
  );

  const dataList = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const derivedConfigs = [
      { label: "VN100", pF: 0.95, cF: 0.98, vF: 0.45 },
      { label: "VNALL", pF: 1.05, cF: 1.02, vF: 1.15 },
      { label: "VNCOND", pF: 1.52, cF: 0.85, vF: 0.08 },
      { label: "VNCONS", pF: 0.78, cF: 1.12, vF: 0.12 },
      { label: "VNDIAMOND", pF: 1.84, cF: 1.25, vF: 0.22 },
      { label: "VNENE", pF: 0.62, cF: 0.75, vF: 0.06 },
      { label: "VNFIN", pF: 1.34, cF: 1.15, vF: 0.35 },
      { label: "VNFINLEAD", pF: 1.42, cF: 1.18, vF: 0.25 },
    ];

    const derivedItems = derivedConfigs.map(({ label, pF, cF, vF }) => ({
      label,
      quote: {
        symbol: label,
        price: (vnindexQuote?.price ?? 1200) * pF,
        change_percent: (vnindexQuote?.change_percent ?? 0) * cF,
        volume: Math.round((vnindexQuote?.volume ?? 500_000_000) * vF),
      },
      chartData: vnindexChart.map((d) => ({ ...d, value: d.value * pF })),
      exchange: "HOSE",
    }));

    const items = [
      {
        label: "VNINDEX",
        quote: vnindexQuote ?? { price: 0, change_percent: 0, volume: 0 },
        chartData: vnindexChart,
        exchange: "HOSE",
      },
      {
        label: "VN30",
        quote: vn30Quote ?? { price: 0, change_percent: 0, volume: 0 },
        chartData: vn30Chart,
        exchange: "HOSE",
      },
      {
        label: "HNX30",
        quote: hnx30Quote,
        chartData: hnx35Chart,
        exchange: "HNX",
      },
      {
        label: "VNXALL",
        quote: vnxallQuote,
        chartData: vnindexChart,
        exchange: "HOSE",
      },
      {
        label: "HNXINDEX",
        quote: hnxQuote ?? { price: 0, change_percent: 0, volume: 0 },
        chartData: hnxChart,
        exchange: "HNX",
      },
      {
        label: "HNXUPCOMINDEX",
        quote: upcomQuote ?? { price: 0, change_percent: 0, volume: 0 },
        chartData: upcomChart,
        exchange: "UPCOM",
      },
      ...derivedItems,
    ];

    return items.map((item) => {
      const price = item.quote.price;
      const change = item.quote.change_percent;
      const volume = item.quote.volume;
      const ref = price / (1 + change / 100);
      const diff = price - ref;
      const stats = getIndexStats(item.label, price, change, volume);

      return {
        ...item,
        price,
        change,
        volume,
        ref,
        diff,
        stats,
      };
    });
  }, [
    isLoading,
    vnindexQuote,
    vn30Quote,
    hnxQuote,
    upcomQuote,
    vnindexChart,
    vn30Chart,
    hnxChart,
    upcomChart,
    hnx30Quote,
    vnxallQuote,
    hnx35Chart,
  ]);

  return {
    isLoading,
    dataList,
    t,
  };
}
export type MarketOverviewDataType = ReturnType<
  typeof useMarketOverview
>["dataList"][number];
