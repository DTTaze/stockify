"use client";

import Link from "next/link";

import { ButtonCustom } from "@/components/common/form/button";
import {
  FormInputPassword,
  FormInputText,
} from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import { cn } from "@/utils";
import { Lock, Mail } from "lucide-react";
import { useLogin } from "../hook";

export default function LoginForm() {
  const { form, onSubmit, loading, email, password } = useLogin();

  const { control, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <div className="flex flex-1 items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="mb-3 text-4xl text-[#1a365d]">Đăng nhập</h2>
          <p className="text-gray-600">Truy cập vào tài khoản của bạn</p>
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

            <FormInputPassword
              control={control}
              name="password"
              inputProps={{
                prefixIcon: <Lock className="h-6 w-6 text-gray-400" />,
              }}
            />

            <div className="flex items-center justify-between text-sm">
              <Label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </Label>

              <Link
                href="/forgot-password"
                className="text-[#1a365d] hover:text-[#d4af37]"
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
                isDisabled ? "bg-gray-300" : "bg-[#1a365d] hover:bg-[#162c4a]",
              )}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </ButtonCustom>
          </form>
        </Form>

        <p className="mt-8 text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-[#1a365d]">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
