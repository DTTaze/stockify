import { TrendingUp } from "lucide-react";

export default function ForgotBanner() {
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex items-center space-x-3">
          <TrendingUp className="h-10 w-10 text-[#d4af37]" />
          <span className="text-3xl text-white">DRAGON PREDICT</span>
        </div>

        <h1 className="mb-6 text-5xl text-white">Khôi phục tài khoản</h1>

        <p className="text-xl text-blue-100">
          Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-8 text-white">
        <Stat value="89.5%" label="Độ chính xác" />
        <Stat value="50+" label="Cổ phiếu" />
        <Stat value="1,234" label="Người dùng" />
      </div>
    </>
  );
}

function Stat({ value, label }: any) {
  return (
    <div>
      <div className="text-3xl text-[#d4af37]">{value}</div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}
