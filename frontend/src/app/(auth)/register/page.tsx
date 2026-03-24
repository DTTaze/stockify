import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title={
            <>
              Tham gia cùng
              <br />
              chúng tôi ngay hôm nay
            </>
          }
          description="Trải nghiệm công nghệ AI tiên tiến trong dự đoán giá cổ phiếu"
          stats={[
            { value: "89.5%", label: "Độ chính xác" },
            { value: "50+", label: "Cổ phiếu" },
            { value: "1,234", label: "Người dùng" },
          ]}
        />
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
