"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";

import { ButtonCustom } from "@/components/common/form/button";
import {
  FormInputPassword,
  FormInputText,
} from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import { cn } from "@/utils";
import { useLogin } from "../hook";

export default function LoginForm() {
  const { form, onSubmit, loading } = useLogin();

  const { control, handleSubmit, formState } = form;
  const { isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <div className="flex flex-1 items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="text-brand-900 mb-3 text-4xl">Đăng nhập</h2>
          <p className="text-gray-600">Truy cập vào tài khoản của bạn</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputText
              control={control}
              label="Email"
              name="email"
              inputProps={{
                prefixIcon: <Mail className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <FormInputPassword
              label="Mật khẩu"
              control={control}
              name="password"
              inputProps={{
                prefixIcon: <Lock className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <div className="flex items-center justify-between text-sm">
              <Label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </Label>

              <Link
                href="/forgot-password"
                className="text-brand-900 hover:hover:text-accent-500"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <ButtonCustom
              type="submit"
              disabled={isDisabled}
              loading={loading}
              className={cn(
                "w-full rounded-lg py-4 text-white",
                isDisabled ? "bg-gray-300" : "bg-brand-900 hover:bg-brand-800",
              )}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </ButtonCustom>
          </form>
        </Form>

        <p className="mt-8 text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-brand-900">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
