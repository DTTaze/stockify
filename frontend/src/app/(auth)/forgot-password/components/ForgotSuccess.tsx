import { CheckCircle } from "lucide-react";

export default function ForgotSuccess({ email, onRetry }: any) {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <h2 className="mb-4 text-3xl text-[#1a365d]">Kiểm tra email của bạn</h2>

      <p className="mb-6 text-gray-600">
        Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>
      </p>

      <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-[#1a365d]">
        Không nhận được email? Kiểm tra spam hoặc{" "}
        <button onClick={onRetry} className="text-[#d4af37] hover:underline">
          thử lại
        </button>
      </div>
    </div>
  );
}
