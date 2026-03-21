"use client";

import { Lock, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === "admin@example.com") {
      } else {
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1a365d] via-[#2d4a7c] to-[#1a365d] p-12 lg:flex lg:w-1/2">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex items-center space-x-3">
            <TrendingUp className="h-10 w-10 text-[#d4af37]" />
            <span className="text-3xl font-light text-white">
              DRAGON PREDICT
            </span>
          </div>

          <h1 className="mb-6 text-5xl leading-tight text-white">
            Dự đoán thông minh,
            <br />
            Đầu tư tự tin
          </h1>

          <p className="text-xl leading-relaxed text-blue-100">
            Nền tảng dự đoán giá cổ phiếu hàng đầu với công nghệ AI tiên tiến
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 text-white">
          <div>
            <div className="mb-2 text-3xl text-[#d4af37]">89.5%</div>
            <div className="text-sm text-blue-100">Độ chính xác</div>
          </div>
          <div>
            <div className="mb-2 text-3xl text-[#d4af37]">50+</div>
            <div className="text-sm text-blue-100">Cổ phiếu</div>
          </div>
          <div>
            <div className="mb-2 text-3xl text-[#d4af37]">1,234</div>
            <div className="text-sm text-blue-100">Người dùng</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="mb-3 text-4xl text-[#1a365d]">Đăng nhập</h2>
            <p className="text-gray-600">Truy cập vào tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-[#1a365d]">Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-all outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#1a365d]">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-all outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#1a365d] focus:ring-[#d4af37]"
                />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a
                href="#"
                className="text-[#1a365d] transition-colors hover:text-[#d4af37]"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1a365d] py-4 text-white shadow-lg transition-all hover:bg-[#2d4a7c] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-[#1a365d] transition-colors hover:text-[#d4af37]"
            >
              Đăng ký ngay
            </Link>
          </p>

          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-sm text-[#1a365d]">
              <strong>Demo accounts:</strong>
            </p>
            <p className="text-sm text-gray-600">Admin: admin@example.com</p>
            <p className="text-sm text-gray-600">User: user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
