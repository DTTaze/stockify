import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface StockChartProps {
  stock: string;
  timeRange: string;
}

// Mock data
const generateMockData = (days: number) => {
  const data = [];
  const basePrice = 80000;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    const open = basePrice + (Math.random() - 0.5) * 10000;
    const close = open + (Math.random() - 0.5) * 5000;
    const high = Math.max(open, close) + Math.random() * 2000;
    const low = Math.min(open, close) - Math.random() * 2000;
    const volume = Math.floor(Math.random() * 1000000) + 500000;

    data.push({
      date: date.toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume,
    });
  }

  return data;
};

export function StockChart({ stock, timeRange }: StockChartProps) {
  const days =
    timeRange === "1D"
      ? 1
      : timeRange === "1W"
        ? 7
        : timeRange === "1M"
          ? 30
          : timeRange === "3M"
            ? 90
            : 365;
  const data = generateMockData(days);

  return (
    <div className="space-y-8">
      {/* Price Chart */}
      <div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1a365d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#1a365d"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div>
        <h3 className="mb-4 text-lg text-[#1a365d]">Khối lượng giao dịch</h3>
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="volume" fill="#d4af37" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
