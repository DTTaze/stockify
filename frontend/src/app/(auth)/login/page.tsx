import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title={
            <>
              Dự đoán thông minh,
              <br />
              Đầu tư tự tin
            </>
          }
          description="Nền tảng dự đoán giá cổ phiếu hàng đầu với công nghệ AI tiên tiến"
          stats={[
            { value: "89.5%", label: "Độ chính xác" },
            { value: "50+", label: "Cổ phiếu" },
            { value: "1,234", label: "Người dùng" },
          ]}
        />
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
