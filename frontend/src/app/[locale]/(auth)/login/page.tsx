"use client";

import { useLanguage } from "@/providers/LanguageProvider";

import AuthLayout from "../components/AuthLayout";
import LeftPanel from "../components/LeftPanel";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      left={
        <LeftPanel
          brandName="DRAGON PREDICT"
          title={
            <>
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
            </>
          }
          description={t("auth.experienceAi")}
          stats={[
            { value: "89.5%", label: t("hero.accuracy") },
            { value: "50+", label: t("watchlist.tableStock") },
            { value: "1,234", label: t("hero.users") },
          ]}
        />
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
