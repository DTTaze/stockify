"use client";

import { Check, Lock, Mail, User } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import {
  FormInputPassword,
  FormInputText,
} from "@/components/common/form/input/FormInput";
import { Form } from "@/components/ui/Form";
import { cn } from "@/utils";
import { useRegister } from "../hook";

export default function RegisterForm() {
  const { form, onSubmit, loading, name, email, password } = useRegister();

  const { control, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const isDisabled = loading || !isValid;

  return (
    <div className="flex flex-1 items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="mb-3 text-4xl text-[#1a365d]">Đăng ký</h2>
          <p className="text-gray-600">Tạo tài khoản mới để bắt đầu</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputText
              label="Họ tên"
              control={control}
              name="username"
              inputProps={{
                prefixIcon: <User className="h-6 w-6 text-gray-400" />,
                suffixIcon: !errors.username && name?.trim() && (
                  <Check className="h-4 w-4 rounded-full bg-green-500 text-gray-400" />
                ),
              }}
            />

            <FormInputText
              label="Email"
              labelClassName="text-[#1a365d]"
              control={control}
              name="email"
              inputProps={{
                prefixIcon: <Mail className="h-6 w-6 text-gray-400" />,

                suffixIcon: !errors.email && email?.trim() && (
                  <Check className="h-4 w-4 rounded-full bg-green-500 text-white" />
                ),
              }}
            />

            <FormInputPassword
              label="Mật khẩu"
              control={control}
              name="password"
              inputProps={{
                prefixIcon: <Lock className="h-6 w-6 text-gray-400" />,
              }}
            />

            <FormInputPassword
              label="Xác nhận mật khẩu"
              control={control}
              name="confirmPassword"
              inputProps={{
                prefixIcon: <Lock className="h-6 w-6 text-gray-400" />,
              }}
            />

            {password && (
              <p className="text-xs text-gray-500">
                Mật khẩu đang được nhập...
              </p>
            )}

            <ButtonCustom
              type="submit"
              disabled={isDisabled}
              loading={loading}
              className={cn(
                "w-full rounded-lg py-4 text-white",
                isDisabled ? "bg-gray-300" : "bg-[#1a365d] hover:bg-[#162c4a]",
              )}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </ButtonCustom>
          </form>
        </Form>
      </div>
    </div>
  );
}
