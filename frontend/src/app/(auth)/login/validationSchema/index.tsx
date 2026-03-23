import { z } from "zod";

import { emailRegex } from "@/utils/regex";

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập email" })
    .regex(emailRegex, {
      message: "Email không hợp lệ",
    }),

  password: z.string().trim().min(1, { message: "Vui lòng nhập mật khẩu" }),
});
