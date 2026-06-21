"use client";

import { useLanguage } from "@/providers/LanguageProvider";

import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title={<>{t("auth.joinUsToday")}</>}
          description={t("auth.experienceAi")}
          stats={[
            { value: "89.5%", label: t("hero.accuracy") },
            { value: "50+", label: t("watchlist.tableStock") },
            { value: "1,234", label: t("hero.users") },
          ]}
        />
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
