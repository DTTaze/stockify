import AuthLayout from "../components/AuthLayout";
import LeftPanel from "./components/LeftPanel";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout left={<LeftPanel />}>
      <LoginForm />
    </AuthLayout>
  );
}
