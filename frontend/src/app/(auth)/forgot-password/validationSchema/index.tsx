import { z } from "zod";
import { emailRegex } from "@/utils/regex";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập email" })
    .regex(emailRegex, {
      message: "Email không hợp lệ",
    }),
});
