"use client";

import { useState } from "react";

import { IndexTicker } from "./components/IndexTicker";
import { MarketOverview } from "./components/MarketOverview";
import { StockBoard } from "./components/StockBoard";
import { StockDetailModal } from "./components/StockDetailModal";

export default function DashBoardPage() {
  const [selectedStock, setSelectedStock] = useState("VCB");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top index ticker bar */}
      <IndexTicker />

      {/* Main Board Workspace */}
      <div className="mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-12">
        {/* Market Overview Index Section */}
        <div className="lg:col-span-12">
          <MarketOverview />
        </div>

        {/* Real-time Stock Board Grid */}
        <div className="flex min-h-[500px] flex-col lg:col-span-12 lg:h-[calc(100vh-14rem)]">
          <StockBoard
            selectedStock={selectedStock}
            onSelectStock={handleSelectStock}
          />
        </div>
      </div>

      {/* Detail Overlay Modal */}
      <StockDetailModal
        symbol={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
