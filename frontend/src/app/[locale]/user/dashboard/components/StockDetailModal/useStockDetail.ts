import { useMemo, useState } from "react";

import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import {
  useQueryPrediction,
  useQueryStockCompanies,
  useQueryStockHistorical,
  useQueryStockQuote,
  useQueryStocks,
} from "@/queries/stocks/QueryHooksStocks";
import {
  IndicatorStatus,
  MarketType,
  StockHistoricalDataType,
  TimePeriod,
} from "@/types/stock/stock.type";
import {
  calculatePriceLimits,
  simulateMatchHistory,
  simulateOrderBook,
} from "@/utils/stockQuoteSim";

import { computeTechnicalIndicators } from "./IndicatorsTab/indicatorHelper";

export type SubTab = "GIAO_DICH" | "AI_PREDICT" | "INDICATORS";

export function useStockDetail(symbol: string, isOpen: boolean) {
  const [activeTab, setActiveTab] = useState<SubTab>("GIAO_DICH");
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.ONE_DAY);
  const [selectedHorizon, setSelectedHorizon] = useState<
    "tomorrow" | "day3" | "day7" | "day14"
  >("day7");

  // Fetch real-time quote for selected stock
  const { data: quote, isLoading: isQuoteLoading } = useQueryStockQuote({
    symbol,
    type: MarketType.STOCK,
    period: TimePeriod.ONE_DAY,
  });

  // Fetch historical price data for charts
  const { data: historicalData = [], isLoading: isHistoryLoading } =
    useQueryStockHistorical({
      symbol,
      type: MarketType.STOCK,
      period,
    });

  // Fetch AI Predictions
  const [modelType, setModelType] = useState<string>("lstm");
  const { data: prediction, isLoading: isPredictLoading } = useQueryPrediction(
    symbol,
    modelType,
    !!symbol && isOpen,
  );

  // Get active models to verify if symbol has LSTM model trained
  const { data: models = [] } = useGetModels();
  const isModelTrained = useMemo(
    () => models.some((m) => m.id === symbol),
    [models, symbol],
  );

  // Fetch company organization names
  const { data: stockCompanies = [] } = useQueryStockCompanies();
  const companyInfo = useMemo(() => {
    return stockCompanies.find((c) => c.symbol === symbol);
  }, [stockCompanies, symbol]);

  const companyName = companyInfo?.organizationName || "Công ty Cổ phần";

  // Fetch stock details to find its exchange
  const { data: stockDetails } = useQueryStocks({
    keyword: symbol,
    limit: 1,
  });

  const stockInfo = useMemo(() => {
    return stockDetails?.rows?.find(
      (s: { symbol: string; exchange?: string }) => s.symbol === symbol,
    );
  }, [stockDetails, symbol]);

  const exchange = stockInfo?.exchange || "HOSE";

  // Formatted chart data
  const chartData = useMemo(() => {
    return historicalData.map((item: StockHistoricalDataType) => ({
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      close: item.close,
      volume: item.volume,
    }));
  }, [historicalData]);

  // AI Forecast Data Points
  const forecastChartData = useMemo(() => {
    if (!prediction) {
      return [];
    }

    const points: Array<{
      name: string;
      actual?: number;
      predicted?: number;
      confidence?: number;
    }> = [];

    // 1. Add historical comparison points if available
    if (prediction.history_compare && prediction.history_compare.length > 0) {
      prediction.history_compare.forEach((item) => {
        let formattedDate = item.date;
        try {
          const parts = item.date.split("-");
          if (parts.length === 3) {
            formattedDate = `${parts[2]}/${parts[1]}`;
          }
        } catch {
          // Fallback to original string
        }

        points.push({
          name: formattedDate,
          actual: item.actual,
          predicted: item.predicted,
        });
      });
    }

    // 2. Add current bridge point
    points.push({
      name: "Hiện tại",
      actual: prediction.current_price,
      predicted: prediction.current_price,
      confidence: 100,
    });

    // 3. Add future forecast points
    if (prediction.tomorrow) {
      points.push({
        name: "Ngày mai",
        predicted: prediction.tomorrow,
        confidence: prediction.tomorrow_confidence || 92,
      });
    }
    if (prediction.day3) {
      points.push({
        name: "3 ngày",
        predicted: prediction.day3,
        confidence: prediction.day3_confidence || 88,
      });
    }
    if (prediction.day7) {
      points.push({
        name: "7 ngày",
        predicted: prediction.day7,
        confidence: prediction.day7_confidence || 85,
      });
    }
    if (prediction.day14) {
      points.push({
        name: "14 ngày",
        predicted: prediction.day14,
        confidence: prediction.day14_confidence || 78,
      });
    }

    return points;
  }, [prediction]);

  // Active AI Horizon Details
  const activePrediction = useMemo(() => {
    if (!prediction) {
      return null;
    }
    const mapping = {
      tomorrow: {
        label: "Ngày mai",
        price: prediction.tomorrow,
        confidence: prediction.tomorrow_confidence || 92,
      },
      day3: {
        label: "3 ngày tới",
        price: prediction.day3,
        confidence: prediction.day3_confidence || 88,
      },
      day7: {
        label: "7 ngày tới",
        price: prediction.day7,
        confidence: prediction.day7_confidence || 85,
      },
      day14: {
        label: "14 ngày tới",
        price: prediction.day14,
        confidence: prediction.day14_confidence || 78,
      },
    };
    const active = mapping[selectedHorizon];
    if (!active || !active.price) {
      return null;
    }

    const change =
      ((active.price - prediction.current_price) / prediction.current_price) *
      100;
    return {
      ...active,
      change,
      trend: active.price >= prediction.current_price ? "UP" : "DOWN",
    };
  }, [prediction, selectedHorizon]);

  // Technical Indicators calculations
  const indicators = useMemo(() => {
    return computeTechnicalIndicators(historicalData);
  }, [historicalData]);

  const bullishCount = indicators.filter(
    (item) => item.status === IndicatorStatus.BULLISH,
  ).length;

  const bearishCount = indicators.filter(
    (item) => item.status === IndicatorStatus.BEARISH,
  ).length;

  // Quote numbers
  const price = quote?.price ?? 0;
  const priceUnit = price;
  const change = quote?.change_percent ?? 0;

  const { tc, tran, san } = calculatePriceLimits(price, change, exchange);
  const limits = { tc, tran, san };

  // Depth data
  const { bids, asks, totalBuyVol, totalSellVol } = simulateOrderBook(
    symbol,
    price,
    tran,
    san,
  );
  const orderBook = { bids, asks, totalBuyVol, totalSellVol };

  const [b1, b2, b3] = bids;
  const [a1, a2, a3] = asks;

  const b1p = b1.price;
  const b1v = b1.volume;
  const b2p = b2.price;
  const b2v = b2.volume;
  const b3p = b3.price;
  const b3v = b3.volume;

  const a1p = a1.price;
  const a1v = a1.volume;
  const a2p = a2.price;
  const a2v = a2.volume;
  const a3p = a3.price;
  const a3v = a3.volume;

  const matchHistory = useMemo(() => {
    return simulateMatchHistory(symbol, price, change, tran, san);
  }, [symbol, price, change, tran, san]);

  const quoteVolume = quote?.volume ?? 0;

  return {
    activeTab,
    setActiveTab,
    period,
    setPeriod,
    selectedHorizon,
    setSelectedHorizon,
    quote,
    prediction,
    modelType,
    setModelType,
    isQuoteLoading,
    isHistoryLoading,
    isPredictLoading,
    isModelTrained,
    companyName,
    exchange,
    chartData,
    forecastChartData,
    activePrediction,
    indicators,
    bullishCount,
    bearishCount,
    priceUnit,
    change,
    tc,
    tran,
    san,
    b1p,
    b1v,
    b2p,
    b2v,
    b3p,
    b3v,
    a1p,
    a1v,
    a2p,
    a2v,
    a3p,
    a3v,
    totalBuyVol,
    totalSellVol,
    quoteVolume,
    orderBook,
    limits,
    matchHistory,
  };
}

export type StockDetailDataType = ReturnType<typeof useStockDetail>;
export type IndicatorsType = StockDetailDataType["indicators"];
export type ForecastDataType = StockDetailDataType["forecastChartData"];
