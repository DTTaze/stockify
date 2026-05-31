import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
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
  );
}
