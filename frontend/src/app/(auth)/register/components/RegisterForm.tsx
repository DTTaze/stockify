"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";

import { ButtonCustom } from "@/components/common/form/button";
import {
  FormInputPassword,
  FormInputText,
} from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";
import { cn } from "@/utils";

import { useRegister } from "../hook";

export default function RegisterForm() {
  const { form, onSubmit, loading } = useRegister();

  const { control, handleSubmit, formState } = form;
  const { isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <div className="flex flex-1 items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="text-brand-900 mb-3 text-4xl">Đăng ký</h2>
          <p className="text-gray-600">Tạo tài khoản mới để bắt đầu</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputText
              control={control}
              label="Họ tên"
              name="username"
              inputProps={{
                prefixIcon: <User className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <FormInputText
              control={control}
              label="Email"
              labelClassName="text-brand-900"
              name="email"
              inputProps={{
                prefixIcon: <Mail className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <FormInputPassword
              control={control}
              label="Mật khẩu"
              name="password"
              inputProps={{
                prefixIcon: <Lock className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <FormInputPassword
              control={control}
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              inputProps={{
                prefixIcon: <Lock className="mr-1 h-6 w-6 text-gray-400" />,
              }}
            />

            <ButtonCustom
              type="submit"
              disabled={isDisabled}
              loading={loading}
              className={cn(
                "w-full rounded-lg py-4 text-white",
                isDisabled ? "bg-gray-300" : "bg-brand-900 hover:bg-brand-800",
              )}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </ButtonCustom>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-brand-900 hover:hover:text-accent-500 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
