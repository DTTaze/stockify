"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema } from "../validationSchema";
import { z } from "zod";

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

export function useForgotPassword(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const email = form.watch("email");

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 1000));

      console.log("Send reset link:", data.email);

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    email,
  };
}
