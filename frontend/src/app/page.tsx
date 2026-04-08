import {
  Activity,
  BarChart3,
  ChevronRight,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50/30 to-white">
      <nav className="border-border fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="hover:text-accent-500\ h-8 w-8" />
              <span className="text-primary text-2xl font-light tracking-wide">
                DRAGON PREDICT
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-primary hover:hover:text-accent-500 px-6 py-2.5 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="from-primary hover:shadow-primary/20 to-brand-700 rounded-lg bg-linear-to-r px-6 py-2.5 text-white transition-all hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="border-accent-500/20 bg-accent-500/10 hover:text-accent-500 mb-6 inline-flex items-center space-x-2 rounded-full border px-4 py-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Công nghệ AI tiên tiến</span>
              </div>

              <h1 className="text-primary mb-6 text-5xl leading-tight lg:text-6xl">
                Dự đoán thông minh,
                <br />
                <span className="hover:text-accent-500">Đầu tư tự tin</span>
              </h1>

              <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                Nền tảng dự đoán giá cổ phiếu thông minh sử dụng Machine
                Learning và Deep Learning, giúp bạn đưa ra quyết định đầu tư
                chính xác và kịp thời.
              </p>

              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="from-primary hover:shadow-primary/30 group to-brand-700 inline-flex items-center justify-center rounded-lg bg-linear-to-r px-8 py-4 text-white transition-all hover:shadow-xl"
                >
                  Bắt đầu ngay
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="border-primary text-primary hover:bg-primary inline-flex items-center justify-center rounded-lg border-2 px-8 py-4 transition-all hover:text-white"
                >
                  Khám phá thêm
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-primary mb-1 text-3xl">10K+</div>
                  <div className="text-muted-foreground text-sm">
                    Người dùng
                  </div>
                </div>
                <div className="bg-border h-12 w-px"></div>
                <div>
                  <div className="text-primary mb-1 text-3xl">99.8%</div>
                  <div className="text-muted-foreground text-sm">
                    Độ chính xác
                  </div>
                </div>
                <div className="bg-border h-12 w-px"></div>
                <div>
                  <div className="text-primary mb-1 text-3xl">24/7</div>
                  <div className="text-muted-foreground text-sm">Hoạt động</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="to-primary/20 from-accent-500/20 absolute inset-0 rounded-3xl bg-linear-to-br blur-3xl"></div>
              <div className="border-border relative rounded-2xl border bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-primary">VN-INDEX</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    +2.5%
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-primary mb-2 text-4xl">1,254.32</div>
                  <div className="text-sm text-green-600">
                    +31.25 điểm hôm nay
                  </div>
                </div>

                <div className="relative flex h-48 items-end justify-between gap-2">
                  {[40, 60, 45, 70, 55, 80, 65, 85, 70, 90, 75, 95].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="from-brand-900 to-accent-500 flex-1 rounded-t bg-gradient-to-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ),
                  )}
                </div>

                <div className="border-border mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">
                      Cao nhất
                    </div>
                    <div className="text-primary">1,268.45</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">
                      Thấp nhất
                    </div>
                    <div className="text-primary">1,242.18</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">
                      Khối lượng
                    </div>
                    <div className="text-primary">850M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                Theo dõi biến động giá theo thời gian thực với biểu đồ
                candlestick chuyên nghiệp, hỗ trợ nhi���u khung thời gian.
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
                Tốc độ xử lý siêu nhanh, cập nhật dữ liệu realtime để bạn không
                bỏ lỡ cơ hội.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="from-primary to-brand-700 relative overflow-hidden rounded-3xl bg-linear-to-br p-12 lg:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="bg-accent-500 absolute top-0 left-0 h-64 w-64 rounded-full blur-3xl"></div>
              <div className="bg-accent-500 absolute right-0 bottom-0 h-64 w-64 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="mb-4 text-4xl text-white">
                Được tin tùởng bởi hàng ngàn nhà đầu tư
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-blue-100">
                Dragon Predict đang là lựa chọn hàng đầu cho các nhà đầu tư tại
                Việt Nam
              </p>

              <div className="grid gap-8 md:grid-cols-4">
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="hover:text-accent-500 mb-2 text-4xl">
                    10,000+
                  </div>
                  <div className="text-blue-100">Người dùng hoạt động</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="hover:text-accent-500 mb-2 text-4xl">1M+</div>
                  <div className="text-blue-100">Dự đoán thành công</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="hover:text-accent-500 mb-2 text-4xl">
                    500+
                  </div>
                  <div className="text-blue-100">Mã cổ phiếu</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="hover:text-accent-500 mb-2 text-4xl">
                    99.8%
                  </div>
                  <div className="text-blue-100">Độ chính xác</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-primary mb-6 text-4xl">
            Sẵn sàng bắt đầu hành trình đầu tư thông minh?
          </h2>
          <p className="text-muted-foreground mb-8 text-xl">
            Tham gia cùng hàng ngàn nhà đầu tư đang sử dụng Dragon Predict
          </p>
          <Link
            href="/register"
            className="from-primary hover:shadow-primary/30 group to-brand-700 inline-flex items-center justify-center rounded-lg bg-linear-to-r px-10 py-4 text-lg text-white transition-all hover:shadow-xl"
          >
            Đăng ký miễn phí ngay
            <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-3 md:mb-0">
              <TrendingUp className="hover:text-accent-500 h-8 w-8" />
              <span className="text-2xl font-light text-white">
                DRAGON PREDICT
              </span>
            </div>
            <div className="text-sm text-blue-100">
              © 2026 Dragon Predict. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
