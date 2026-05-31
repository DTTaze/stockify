import { TrendingUp } from "lucide-react";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="border-border fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="hover:text-accent-500 h-8 w-8" />
            <span className="text-primary text-2xl font-light tracking-wide">
              DRAGON PREDICT
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-primary hover:text-accent-500 px-6 py-2.5 transition-colors"
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
  );
}
