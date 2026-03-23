import { TrendingUp } from "lucide-react";

export default function RegisterBanner() {
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex items-center space-x-3">
          <TrendingUp className="h-10 w-10 text-[#d4af37]" />
          <span className="text-3xl font-light text-white">DRAGON PREDICT</span>
        </div>

        <h1 className="mb-6 text-5xl leading-tight text-white">
          Tham gia cùng
          <br />
          chúng tôi ngay hôm nay
        </h1>

        <p className="text-xl leading-relaxed text-blue-100">
          Trải nghiệm công nghệ AI tiên tiến trong dự đoán giá cổ phiếu
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
    </>
  );
}
