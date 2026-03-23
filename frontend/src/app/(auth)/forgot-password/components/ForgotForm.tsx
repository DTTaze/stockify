"use client";

import { ButtonCustom } from "@/components/common/form/button";
import { FormInputText } from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";

import { cn } from "@/utils";
import { Mail } from "lucide-react";
import { useForgotPassword } from "../hook";

export default function ForgotForm({ onSuccess }: any) {
  const { form, onSubmit, loading, email } = useForgotPassword(onSuccess);

  const { control, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <>
      <div className="mb-12">
        <h2 className="mb-3 text-4xl text-[#1a365d]">Quên mật khẩu</h2>
        <p className="text-gray-600">
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInputText
            control={control}
            name="email"
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
              isDisabled ? "bg-gray-300" : "bg-[#1a365d] hover:bg-[#162c4a]",
            )}
          >
            {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </ButtonCustom>
        </form>
      </Form>
    </>
  );
}
