"use client";

import { RegisterFormPayload } from "@/types/auth/auth.payload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "../validationSchema";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<RegisterFormPayload>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const name = form.watch("username");
  const email = form.watch("email");
  const password = form.watch("password");

  const passwordValue = form.watch("password");
  const confirmPasswordValue = form.watch("confirmPassword");

  if (passwordValue && confirmPasswordValue) {
    form.trigger("confirmPassword");
  }

  const onSubmit = async (data: RegisterFormPayload) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Đăng ký thành công:", data);

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    isSubmitted,
    name,
    email,
    password,
  };
}
