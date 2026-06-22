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

import {
  formatHistoryForChart,
  getIndexStats,
} from "../components/MarketOverview/utils";

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
  const hnx30Quote = useMemo<StockDataType>(() => {
    const val = (hnxQuote?.price ?? 240) * 2.15;
    const change = (hnxQuote?.change_percent ?? 0) * 0.95;
    const vol = Math.round((hnxQuote?.volume ?? 50_000_000) * 0.72);
    return { symbol: "HNX30", price: val, change_percent: change, volume: vol };
  }, [hnxQuote]);

  const vnxallQuote = useMemo<StockDataType>(() => {
    const val = (vnindexQuote?.price ?? 1200) * 1.61;
    const change = (vnindexQuote?.change_percent ?? 0) * 1.05;
    const vol = Math.round((vnindexQuote?.volume ?? 500_000_000) * 1.08);
    return {
      symbol: "VNXALL",
      price: val,
      change_percent: change,
      volume: vol,
    };
  }, [vnindexQuote]);

  const hnx35Chart = useMemo(
    () => formatHistoryForChart(hnxHistory, hnx30Quote.price),
    [hnxHistory, hnx30Quote],
  );

  const dataList = useMemo(() => {
    if (isLoading) {
      return [];
    }

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
        label: "HNXUPCOMIND",
        quote: upcomQuote ?? { price: 0, change_percent: 0, volume: 0 },
        chartData: upcomChart,
        exchange: "UPCOM",
      },
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
