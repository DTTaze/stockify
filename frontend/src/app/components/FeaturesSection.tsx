import {
  Activity,
  BarChart3,
  LineChart,
  Shield,
  Target,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="from-primary to-brand-700 relative overflow-hidden bg-linear-to-br px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-10">
        <div className="bg-accent-500 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl"></div>
        <div className="bg-accent-500 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl text-white">Tính năng vượt trội</h2>
          <p className="mx-auto max-w-2xl text-xl text-blue-100">
            Công nghệ AI tiên tiến kết hợp phân tích kỹ thuật chuyên sâu
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <BarChart3 className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Biểu đồ Candlestick</h3>
            <p className="leading-relaxed text-blue-100">
              Theo dõi biến động giá theo thời gian thực với biểu đồ candlestick
              chuyên nghiệp, hỗ trợ nhiều khung thời gian.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <LineChart className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Dự đoán AI</h3>
            <p className="leading-relaxed text-blue-100">
              Mô hình Machine Learning tiên tiến dự đoán xu hướng giá cổ phiếu
              với độ chính xác cao.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Activity className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Chỉ báo kỹ thuật</h3>
            <p className="leading-relaxed text-blue-100">
              Phân tích chuyên sâu với các chỉ báo MA, EMA, RSI, MACD và nhiều
              công cụ khác.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Target className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Watchlist thông minh</h3>
            <p className="leading-relaxed text-blue-100">
              Theo dõi danh mục cổ phiếu yêu thích, nhận thông báo khi có tín
              hiệu quan trọng.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Shield className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Bảo mật tuyệt đối</h3>
            <p className="leading-relaxed text-blue-100">
              Dữ liệu được mã hóa và bảo vệ với tiêu chuẩn bảo mật cao nhất
              trong ngành.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Zap className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">Xử lý nhanh</h3>
            <p className="leading-relaxed text-blue-100">
              Tốc độ xử lý siêu nhanh, cập nhật dữ liệu realtime để bạn không bỏ
              lỡ cơ hội.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
