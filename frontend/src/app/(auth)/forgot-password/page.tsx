"use client";

import { useState } from "react";
import ForgotBanner from "./components/ForgotBanner";
import ForgotForm from "./components/ForgotForm";
import ForgotSuccess from "./components/ForgotSuccess";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthLayout left={<ForgotBanner />}>
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {!submitted ? (
            <ForgotForm
              onSuccess={(email: string) => {
                setEmail(email);
                setSubmitted(true);
              }}
            />
          ) : (
            <ForgotSuccess email={email} onRetry={() => setSubmitted(false)} />
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
