import { Activity, BarChart3, TrendingUp, ChevronRight } from "lucide-react";

interface TechnicalIndicatorsProps {
  stock: string;
}

export function TechnicalIndicators({ stock }: TechnicalIndicatorsProps) {
  const indicators = [
    {
      name: "MA(20)",
      value: "80,500",
      status: "neutral",
      icon: TrendingUp,
      description: "Moving Average",
    },
    {
      name: "EMA(50)",
      value: "79,800",
      status: "bullish",
      icon: TrendingUp,
      description: "Exponential MA",
    },
    {
      name: "RSI(14)",
      value: "58.2",
      status: "neutral",
      icon: Activity,
      description: "Relative Strength",
    },
    {
      name: "MACD",
      value: "+125",
      status: "bullish",
      icon: BarChart3,
      description: "Momentum",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bullish":
        return "bg-green-50 text-green-700 border-green-200";
      case "bearish":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "bullish":
        return "Tăng";
      case "bearish":
        return "Giảm";
      default:
        return "Trung tính";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "bullish":
        return "bg-green-500";
      case "bearish":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl text-[#1a365d]">Chỉ báo kỹ thuật</h2>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {indicators.map((indicator, index) => {
          const Icon = indicator.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-100 p-4 transition-all hover:border-[#d4af37] hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-3">
                  <div className="rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-2.5">
                    <Icon className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-[#1a365d]">
                        {indicator.name}
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusDot(indicator.status)}`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {indicator.description}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-1 text-lg text-[#1a365d]">
                    {indicator.value}
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(indicator.status)}`}
                  >
                    {getStatusText(indicator.status)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
        <p className="text-xs text-gray-700">
          <strong className="text-[#1a365d]">Tín hiệu kỹ thuật:</strong> 2
          bullish, 2 neutral
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Các chỉ báo được cập nhật theo thời gian thực
        </p>
      </div>
    </div>
  );
}
