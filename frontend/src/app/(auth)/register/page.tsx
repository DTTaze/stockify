import AuthLayout from "../components/AuthLayout";
import RegisterBanner from "./components/RegisterBanner";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout left={<RegisterBanner />}>
      <RegisterForm />
    </AuthLayout>
  );
}
