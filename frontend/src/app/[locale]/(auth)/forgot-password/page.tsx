"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";

import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import ForgotForm from "./components/ForgotForm";
import ForgotSuccess from "./components/ForgotSuccess";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title={t("auth.recoverAccount")}
          description={t("auth.dontWorry")}
          stats={[
            { value: "89.5%", label: t("hero.accuracy") },
            { value: "50+", label: t("watchlist.tableStock") },
            { value: "1,234", label: t("hero.users") },
          ]}
        />
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="hover:text-brand-900 dark:hover:text-accent-400 mb-8 inline-flex items-center space-x-2 text-gray-600 transition-colors dark:text-neutral-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("auth.backToLogin")}</span>
          </Link>

          <div className="flex justify-center bg-white dark:bg-neutral-950">
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
