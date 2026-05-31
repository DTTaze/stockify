import { ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

const MOCK_VN_INDEX_HEIGHTS = [
  { id: "h1", value: 40 },
  { id: "h2", value: 60 },
  { id: "h3", value: 45 },
  { id: "h4", value: 70 },
  { id: "h5", value: 55 },
  { id: "h6", value: 80 },
  { id: "h7", value: 65 },
  { id: "h8", value: 85 },
  { id: "h9", value: 70 },
  { id: "h10", value: 90 },
  { id: "h11", value: 75 },
  { id: "h12", value: 95 },
];

export function HeroSection() {
  return (
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
              Nền tảng dự đoán giá cổ phiếu thông minh sử dụng Machine Learning
              và Deep Learning, giúp bạn đưa ra quyết định đầu tư chính xác và
              kịp thời.
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
                <div className="text-muted-foreground text-sm">Người dùng</div>
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
                {MOCK_VN_INDEX_HEIGHTS.map((item) => (
                  <div
                    key={item.id}
                    className="from-brand-900 to-accent-500 flex-1 rounded-t bg-linear-to-t"
                    style={{ height: `${item.value}%` }}
                  ></div>
                ))}
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
  );
}
