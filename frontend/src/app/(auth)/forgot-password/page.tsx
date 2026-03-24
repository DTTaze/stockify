"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import ForgotForm from "./components/ForgotForm";
import ForgotSuccess from "./components/ForgotSuccess";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title="Khôi phục tài khoản"
          description="Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập"
          stats={[
            { value: "89.5%", label: "Độ chính xác" },
            { value: "50+", label: "Cổ phiếu" },
            { value: "1,234", label: "Người dùng" },
          ]}
        />
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="mb-8 inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-[#1a365d]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại đăng nhập</span>
          </Link>

          <div className="flex justify-center bg-white">
            <div className="w-full max-w-md">
              {!submitted ? (
                <ForgotForm
                  onSuccess={(email: string) => {
                    setEmail(email);
                    setSubmitted(true);
                  }}
                />
              ) : (
                <ForgotSuccess
                  email={email}
                  onRetry={() => setSubmitted(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
