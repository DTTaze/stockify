import { TrendingUp, TrendingDown, Calendar, Sparkles } from "lucide-react";

interface PredictionPanelProps {
  stock: string;
}

export function PredictionPanel({ stock }: PredictionPanelProps) {
  const predictions = [
    { day: "Ngày mai", price: 82500, change: 2.3, trend: "UP", confidence: 92 },
    { day: "+3 ngày", price: 84200, change: 4.5, trend: "UP", confidence: 88 },
    { day: "+7 ngày", price: 81800, change: 1.2, trend: "UP", confidence: 85 },
    {
      day: "+14 ngày",
      price: 79500,
      change: -1.1,
      trend: "DOWN",
      confidence: 78,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-3">
            <Sparkles className="h-6 w-6 text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-2xl text-[#1a365d]">Dự đoán AI</h2>
            <p className="text-sm text-gray-600">Powered by Machine Learning</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border-2 border-gray-100 p-5 transition-all hover:border-[#d4af37] hover:shadow-md"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-[#1a365d]/5 to-transparent"></div>

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{pred.day}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {pred.trend === "UP" ? (
                    <div className="rounded-lg bg-green-100 p-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-red-100 p-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-2 text-3xl text-[#1a365d]">
                {pred.price.toLocaleString("vi-VN")} ₫
              </div>

              <div className="flex items-center justify-between">
                <div
                  className={`text-sm ${pred.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {pred.change >= 0 ? "+" : ""}
                  {pred.change}%
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-gray-500">Độ tin cậy:</div>
                  <div className="text-sm text-[#1a365d]">
                    {pred.confidence}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-[#1a365d] to-[#d4af37]"
                  style={{ width: `${pred.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex items-start space-x-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-[#1a365d]" />
          <div>
            <p className="mb-1 text-sm text-[#1a365d]">
              <strong>Xu hướng tổng quan:</strong> Tăng nhẹ trong ngắn hạn, có
              thể điều chỉnh trong dài hạn
            </p>
            <p className="text-xs text-gray-600">
              * Dự đoán dựa trên mô hình AI với độ chính xác 89.5%, chỉ mang
              tính chất tham khảo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
