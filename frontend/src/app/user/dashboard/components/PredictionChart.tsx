"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PredictionChartProps {
  data: {
    name: string;
    price: number;
    confidence: number;
  }[];
}

export function PredictionChart({ data }: PredictionChartProps) {
  return (
    <div className="min-h-[220px] rounded-xl border border-gray-100 p-5 lg:col-span-3">
      <p className="text-brand-900 mb-4 text-sm font-semibold">
        Đường quỹ đạo dự đoán giá
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 500 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val: number) => val.toLocaleString("vi-VN")}
            tick={{ fontSize: 9, fontWeight: 500 }}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              `${value?.toLocaleString("vi-VN")} ₫`,
              "Giá",
            ]}
            labelClassName="font-bold text-gray-700 text-xs"
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#1E3A8A"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorPred)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
