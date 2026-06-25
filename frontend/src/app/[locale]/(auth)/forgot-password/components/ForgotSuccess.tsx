"use client";

import { CheckCircle } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";

interface ForgotSuccessProps {
  email: string;
  onRetry: () => void;
}

export default function ForgotSuccess(props: ForgotSuccessProps) {
  const { email, onRetry } = props;
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-950/30">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="text-brand-900 mb-4 text-3xl dark:text-white">
        {t("auth.checkEmail")}
      </h2>

      <p className="mb-6 text-gray-600 dark:text-neutral-400">
        {t("auth.sentLinkTo", { email })}
      </p>

      <div className="text-brand-900 dark:bg-brand-950/40 mb-6 rounded-lg bg-blue-50 p-4 text-sm dark:text-neutral-200">
        {t("auth.noEmailReceived")}{" "}
        <ButtonCustom
          onClick={onRetry}
          className="hover:text-accent-500 text-brand-900 dark:text-accent-400 inline h-auto border-0 bg-transparent p-0 shadow-none hover:scale-100 hover:underline"
        >
          {t("auth.tryAgain")}
        </ButtonCustom>
      </div>
    </div>
  );
}
