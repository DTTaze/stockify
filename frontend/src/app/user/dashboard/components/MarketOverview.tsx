import { TrendingDown, TrendingUp } from "lucide-react";

export function MarketOverview() {
  const indices = [
    { name: "VN-INDEX", value: "1,258.45", change: 1.23, trend: "up" },
    { name: "VN30", value: "1,312.67", change: 0.85, trend: "up" },
    { name: "HNX-INDEX", value: "235.82", change: -0.45, trend: "down" },
    { name: "UPCOM", value: "92.15", change: 0.32, trend: "up" },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] p-6 text-white shadow-lg">
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
