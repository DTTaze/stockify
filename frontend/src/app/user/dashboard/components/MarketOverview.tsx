import { TrendingDown, TrendingUp } from "lucide-react";

import {
  initialStockData,
  useQueryIndexQuote,
} from "@/queries/stocks/QueryHooksStocks";

function useMarketIndices() {
  const vnIndex = useQueryIndexQuote("vn-index");
  const vn30 = useQueryIndexQuote("vn30");
  const hnxIndex = useQueryIndexQuote("hnx-index");
  const upcom = useQueryIndexQuote("upcom");

  return [
    { label: "VN-INDEX", data: vnIndex.data },
    { label: "VN30", data: vn30.data },
    { label: "HNX-INDEX", data: hnxIndex.data },
    { label: "UPCOM", data: upcom.data },
  ];
}

export function MarketOverview() {
  const rawIndices = useMarketIndices();

  const indices = rawIndices.map(({ label, data = initialStockData }) => ({
    name: label,
    value: data.price.toLocaleString(),
    change: data.change_percent,
    trend: data.change >= 0 ? "up" : "down",
  }));

  return (
    <div className="rounded-xl bg-linear-to-r from-[#1a365d] to-[#2d4a7c] p-6 text-white shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg">Tổng quan thị trường</h2>
        <div className="text-sm text-blue-200">
          Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {indices.map((index) => (
          <div
            key={index.name}
            className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="mb-2 text-xs text-blue-200">{index.name}</div>
            <div className="mb-1 text-2xl">{index.value}</div>

            <div
              className={`flex items-center space-x-1 text-sm ${
                index.trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {index.trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {index.change >= 0 ? "+" : ""}
                {index.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
