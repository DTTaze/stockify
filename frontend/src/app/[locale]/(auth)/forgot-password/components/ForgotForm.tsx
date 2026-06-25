"use client";

import { Mail } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { FormInputText } from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

import { useForgotPassword } from "../hook";

interface ForgotFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotForm(props: ForgotFormProps) {
  const { onSuccess } = props;
  const { form, onSubmit, loading, email } = useForgotPassword(onSuccess);
  const { t } = useLanguage();

  const { control, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <>
      <div className="mb-12">
        <h2 className="text-brand-900 mb-3 text-4xl dark:text-white">
          {t("auth.forgotPassword")}
        </h2>
        <p className="text-gray-600 dark:text-neutral-400">
          {t("auth.enterEmailReset")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInputText
            control={control}
            name="email"
            label={t("auth.email")}
            inputProps={{
              prefixIcon: <Mail className="h-6 w-6 text-gray-400" />,
              suffixIcon: !errors.email && email?.trim() && (
                <div className="h-4 w-4 rounded-full bg-green-500" />
              ),
            }}
          />

          <ButtonCustom
            type="submit"
            disabled={isDisabled}
            loading={loading}
            className={cn(
              "w-full rounded-lg py-4 text-white",
              isDisabled
                ? "bg-gray-300 dark:bg-neutral-800 dark:text-neutral-500"
                : "bg-brand-900 hover:bg-brand-800 dark:bg-accent-500 dark:hover:bg-accent-600 font-semibold dark:text-neutral-950",
            )}
          >
            {loading ? t("auth.sending") : t("auth.sendLink")}
          </ButtonCustom>
        </form>
      </Form>
    </>
  );
}
