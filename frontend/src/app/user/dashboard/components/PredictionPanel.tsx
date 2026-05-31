"use client";

import {
  Calendar,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useGetModels } from "@/queries/model-management/QueryHooksModelManagement";
import { useQueryPrediction } from "@/queries/stocks/QueryHooksStocks";

import { PredictionChart } from "./PredictionChart";

interface PredictionPanelProps {
  stock: string;
}

export function PredictionPanel(props: PredictionPanelProps) {
  const { stock } = props;

  const [selectedSymbol, setSelectedSymbol] = useState<string>(stock || "VCB");
  const [selectedHorizon, setSelectedHorizon] = useState<
    "tomorrow" | "day3" | "day7" | "day14"
  >("day7");

  useEffect(() => {
    if (stock) {
      setSelectedSymbol(stock);
    }
  }, [stock]);

  const {
    data: prediction,
    isLoading: predictionLoading,
    error,
  } = useQueryPrediction(selectedSymbol, !!selectedSymbol);

  const { data: models = [] } = useGetModels();

  const chartData = useMemo(() => {
    if (!prediction) {
      return [];
    }

    const points = [
      {
        name: "Hiện tại",
        price: prediction.current_price,
        confidence: 100,
      },
    ];

    if (prediction.tomorrow) {
      points.push({
        name: "Ngày mai",
        price: prediction.tomorrow,
        confidence: prediction.tomorrow_confidence || 92,
      });
    }

    if (prediction.day3) {
      points.push({
        name: "+3 ngày",
        price: prediction.day3,
        confidence: prediction.day3_confidence || 88,
      });
    }

    if (prediction.day7) {
      points.push({
        name: "+7 ngày",
        price: prediction.day7,
        confidence: prediction.day7_confidence || 85,
      });
    }

    if (prediction.day14) {
      points.push({
        name: "+14 ngày",
        price: prediction.day14,
        confidence: prediction.day14_confidence || 78,
      });
    }

    return points;
  }, [prediction]);

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

  const isLoading = predictionLoading;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="from-brand-900 to-brand-700 rounded-lg bg-linear-to-br p-3">
            <Sparkles className="hover:text-accent-500 h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-brand-900 text-2xl font-bold">Dự đoán AI</h2>
            <p className="text-sm font-medium text-gray-600">
              Powered by Machine Learning LSTM Model
            </p>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      {models.length > 0 && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Chọn mã cổ phiếu đã train:
          </p>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedSymbol(model.id)}
                className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                  selectedSymbol === model.id
                    ? "bg-brand-900 text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
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
          <p className="text-sm font-medium">
            Không thể tải dữ liệu dự đoán. Vui lòng thử lại sau hoặc đảm bảo mô
            hình đã được huấn luyện.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-full animate-pulse space-y-4">
            <div className="h-48 rounded-xl bg-gray-100"></div>
            <div className="h-12 rounded-xl bg-gray-100"></div>
          </div>
        </div>
      ) : activePrediction ? (
        <div className="space-y-6">
          {/* Timeframe Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-3">
            {(["tomorrow", "day3", "day7", "day14"] as const).map((horizon) => {
              const labels = {
                tomorrow: "Ngày mai",
                day3: "3 ngày",
                day7: "7 ngày",
                day14: "14 ngày",
              };
              const isActive = selectedHorizon === horizon;
              return (
                <button
                  key={horizon}
                  onClick={() => setSelectedHorizon(horizon)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-900 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {labels[horizon]}
                </button>
              );
            })}
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left Hero Card: Active Prediction */}
            <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-linear-to-b from-gray-50 to-white p-5 shadow-xs lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {activePrediction.label} (Dự kiến)
                    </span>
                  </div>
                  {activePrediction.trend === "UP" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      <TrendingUp className="h-3 w-3" /> Tăng giá
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                      <TrendingDown className="h-3 w-3" /> Giảm giá
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-brand-900 text-3xl font-bold tracking-tight">
                    {activePrediction.price.toLocaleString("vi-VN")} ₫
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${
                      activePrediction.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {activePrediction.change >= 0 ? "+" : ""}
                    {activePrediction.change.toFixed(2)}% so với hiện tại
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className="text-brand-900 h-4 w-4" />
                    <span>Độ tin cậy dự báo:</span>
                  </div>
                  <span className="text-brand-900 font-bold">
                    {activePrediction.confidence}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="from-brand-900 to-accent-500 h-full bg-linear-to-r transition-all duration-500"
                    style={{ width: `${activePrediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right Trajectory Chart */}
            <PredictionChart data={chartData} />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
          <p className="text-sm font-medium">
            Không có dữ liệu dự đoán cho {selectedSymbol}. Vui lòng chọn mã khác
            hoặc cập nhật dữ liệu.
          </p>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="text-brand-900 mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-brand-900 mb-1 text-sm font-semibold">
              Khuyến cáo rủi ro thị trường
            </p>
            <p className="text-xs font-medium text-gray-600">
              * Mọi dữ liệu dự báo từ AI LSTM chỉ mang tính chất tham khảo dựa
              trên dữ liệu lịch sử đã qua, tuyệt đối không được coi là lời
              khuyên hay cam kết đầu tư tài chính.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
