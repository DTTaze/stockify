import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = form.watch("email");
  const password = form.watch("password");

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 1000));

      console.log("Login success", data);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    email,
    password,
  };
}
