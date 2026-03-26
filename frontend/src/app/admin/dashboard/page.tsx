"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Cpu,
  Database,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Tổng User",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Dữ liệu (GB)",
      value: "45.2",
      change: "+5%",
      icon: Database,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Models đang chạy",
      value: "8",
      change: "0",
      icon: Cpu,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Dự đoán hôm nay",
      value: "3,456",
      change: "+23%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const performanceData = [
    { time: "00:00", requests: 120, accuracy: 85, load: 45 },
    { time: "04:00", requests: 80, accuracy: 87, load: 38 },
    { time: "08:00", requests: 250, accuracy: 86, load: 62 },
    { time: "12:00", requests: 380, accuracy: 88, load: 78 },
    { time: "16:00", requests: 420, accuracy: 87, load: 85 },
    { time: "20:00", requests: 290, accuracy: 89, load: 68 },
  ];

  const recentActivities = [
    {
      type: "success",
      message: "Model LSTM-v3 đã được deploy thành công",
      time: "5 phút trước",
    },
    {
      type: "warning",
      message: "Dữ liệu VNM cần cập nhật",
      time: "15 phút trước",
    },
    {
      type: "success",
      message: "User mới đăng ký: nguyenvana@email.com",
      time: "1 giờ trước",
    },
    {
      type: "success",
      message: "Cập nhật dữ liệu 50 cổ phiếu hoàn tất",
      time: "2 giờ trước",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1a365d]">Dashboard</h1>
          <p className="mt-1 text-gray-600">Tổng quan hệ thống</p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <Activity className="h-4 w-4 animate-pulse text-green-500" />
          <span className="text-sm text-gray-600">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 shadow-md`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-sm ${stat.bgColor} ${stat.textColor}`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mb-1 text-3xl text-[#1a365d]">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-[#1a365d]">Hiệu suất hệ thống</h2>
            <p className="mt-1 text-sm text-gray-600">24 giờ qua</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#1a365d]"></div>
              <span className="text-sm text-gray-600">Requests</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#d4af37]"></div>
              <span className="text-sm text-gray-600">Accuracy</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1a365d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
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
              dataKey="requests"
              stroke="#1a365d"
              strokeWidth={2}
              fill="url(#colorRequests)"
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#d4af37"
              strokeWidth={2}
              fill="url(#colorAccuracy)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl text-[#1a365d]">Hoạt động gần đây</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 rounded-xl border-2 p-4 transition-all hover:shadow-sm ${
                activity.type === "success"
                  ? "border-green-100 bg-green-50"
                  : activity.type === "warning"
                    ? "border-yellow-100 bg-yellow-50"
                    : "border-red-100 bg-red-50"
              }`}
            >
              {activity.type === "success" ? (
                <div className="rounded-lg bg-green-500 p-1.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div
                  className={`${activity.type === "warning" ? "bg-yellow-500" : "bg-red-500"} rounded-lg p-1.5`}
                >
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-[#1a365d]">{activity.message}</p>
                <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
