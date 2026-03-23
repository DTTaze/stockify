import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1a365d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-[#d4af37]" />
              <span className="text-lg">DRAGON PREDICT</span>
            </div>
            <p className="text-sm text-blue-200">
              Nền tảng dự đoán giá cổ phiếu hàng đầu với công nghệ AI
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm text-[#d4af37]">Liên kết</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-white">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm text-[#d4af37]">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-white">
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-blue-200">
          © 2026 Dragon Predict. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
