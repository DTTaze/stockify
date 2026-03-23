import { z } from "zod";

import { emailRegex, usernameRegex } from "@/utils/regex";

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng nhập tên người dùng" })
      .max(60, { message: "Tên người dùng tối đa 60 ký tự" })
      .regex(usernameRegex, {
        message: "Tên người dùng không hợp lệ",
      }),

    email: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng nhập email" })
      .regex(emailRegex, {
        message: "Email không hợp lệ",
      }),

    password: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" }),

    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),

    referrerCode: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });
