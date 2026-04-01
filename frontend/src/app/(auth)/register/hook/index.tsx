"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { handleShowMessage } from "@/helpers/error-code";
import { signUpHandlers } from "@/services/auth/authHandlers";
import { RegisterFormPayload } from "@/types/auth/auth.payload";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "../validationSchema";

export function useRegister() {
  const router = useRouter();
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

  const username = form.watch("username");
  const email = form.watch("email");
  const password = form.watch("password");

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === "password") {
        form.trigger("confirmPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.trigger, form]);

  const onSubmit = async (data: RegisterFormPayload) => {
    try {
      setLoading(true);

      const response = await signUpHandlers(data);

      if (!response.success) {
        toast.error(handleShowMessage(response.code));
        return;
      }

      toast.success("Đăng kí thành công");
      setIsSubmitted(true);
      router.push("/login");
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
    username,
    email,
    password,
  };
}
