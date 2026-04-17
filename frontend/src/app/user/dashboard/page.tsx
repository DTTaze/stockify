"use client";

import { useState } from "react";

import { TimePeriod } from "@/types/stock/stock.type";
import { MarketOverview } from "./components/MarketOverview";
import { PredictionPanel } from "./components/PredictionPanel";
import { StockChart } from "./components/StockChart";
import { StockSelector } from "./components/StockSelector";
import { TechnicalIndicators } from "./components/TechnicalIndicators";
import TradingVolumeChart from "./components/TradingVolumeChart";

export default function DashBoardPage() {
  const [stock, setSelectedStock] = useState("FPT");
  const [period, setPeriod] = useState(TimePeriod.ONE_DAY);

  return (
    <div className="space-y-6 p-6">
      <MarketOverview />

      <StockSelector
        value={stock}
        onChange={setSelectedStock}
        period={period}
        onChangePeriod={setPeriod}
      />

      <StockChart symbol={stock} period={period} />

      <TradingVolumeChart symbol={stock} period={period} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PredictionPanel stock={stock} />
        </div>
        <div>
          <TechnicalIndicators stock={stock} />
        </div>
      </div>
    </div>
  );
}
