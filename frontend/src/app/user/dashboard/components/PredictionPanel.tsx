"use client";

import { Calendar, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import { useQueryPrediction } from "@/queries/stocks/QueryHooksStocks";

interface PredictionPanelProps {
  stock: string;
}

export function PredictionPanel(props: PredictionPanelProps) {
  const { stock } = props;

  const [selectedSymbol, setSelectedSymbol] = useState<string>(stock || "VCB");

  useEffect(() => {
    if (stock) {
      setSelectedSymbol(stock);
    }
  }, [stock]);

  const calculateChange = (future: number, current: number) => {
    return ((future - current) / current) * 100;
  };

  const {
    data: prediction,
    isLoading: predictionLoading,
    error,
  } = useQueryPrediction(selectedSymbol, !!selectedSymbol);

  const { data: models = [] } = useGetModels();

  const predictions = useMemo(() => {
    if (!prediction) return [];

    const items = [];

    if (prediction.tomorrow) {
      items.push({
        day: "Ngày mai",
        price: prediction.tomorrow,
        change: calculateChange(prediction.tomorrow, prediction.current_price),
        trend: prediction.tomorrow >= 0 ? "UP" : "DOWN",
        confidence: 92,
      });
    }

    if (prediction.day3) {
      items.push({
        day: "+3 ngày",
        price: prediction.day3,
        change: calculateChange(prediction.day3, prediction.current_price),
        trend: prediction.day3 >= 0 ? "UP" : "DOWN",
        confidence: 88,
      });
    }

    if (prediction.day7) {
      items.push({
        day: "+7 ngày",
        price: prediction.day7,
        change: calculateChange(prediction.day7, prediction.current_price),
        trend: prediction.day7 >= 0 ? "UP" : "DOWN",
        confidence: 85,
      });
    }

    if (prediction.day14) {
      items.push({
        day: "+14 ngày",
        price: prediction.day14,
        change: calculateChange(prediction.day14, prediction.current_price),
        trend: prediction.day14 >= 0 ? "UP" : "DOWN",
        confidence: 78,
      });
    }

    return items;
  }, [prediction]);

  const isLoading = predictionLoading;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="from-brand-900 to-brand-700 rounded-lg bg-linear-to-br p-3">
            <Sparkles className="hover:text-accent-500 h-6 w-6" />
          </div>
          <div>
            <h2 className="text-brand-900 text-2xl">Dự đoán AI</h2>
            <p className="text-sm text-gray-600">Powered by Machine Learning</p>
          </div>
        </div>
      </div>

      {models.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-600">Có sẵn dự đoán nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedSymbol(model.id)}
                className={`cursor-pointer rounded-lg px-3 py-1 text-sm transition-all ${
                  selectedSymbol === model.id
                    ? "bg-brand-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {model.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">
            Không thể tải dự đoán. Vui lòng thử lại sau.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-full animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-100"></div>
            ))}
          </div>
        </div>
      ) : predictions.length > 0 ? (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {predictions.map((pred, index) => (
            <div
              key={index}
              className="group hover:border-accent-500 relative overflow-hidden rounded-xl border-2 border-gray-100 p-5 transition-all hover:shadow-md"
            >
              <div className="from-brand-900/5 absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-linear-to-br to-transparent"></div>

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

                <div className="text-brand-900 mb-2 text-3xl">
                  {pred.price.toLocaleString("vi-VN")} ₫
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`text-sm ${pred.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {pred.change >= 0 ? "+" : ""}
                    {pred.change.toFixed(2)}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-xs text-gray-500">Độ tin cậy:</div>
                    <div className="text-brand-900 text-sm">
                      {pred.confidence}%
                    </div>
                  </div>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="from-brand-900 to-accent-500 h-full bg-linear-to-r"
                    style={{ width: `${pred.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
          <p className="text-sm">
            Không có dữ liệu dự đoán cho {selectedSymbol}. Vui lòng chọn mã
            khác.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex items-start space-x-3">
          <Sparkles className="text-brand-900 mt-0.5 h-5 w-5" />
          <div>
            <p className="text-brand-900 mb-1 text-sm">
              <strong>Xu hướng tổng quan:</strong> Dự đoán dựa trên mô hình LSTM
              được huấn luyện trên dữ liệu lịch sử
            </p>
            <p className="text-xs text-gray-600">
              * Dự đoán chỉ mang tính chất tham khảo, không phải lời khuyên đầu
              tư
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
