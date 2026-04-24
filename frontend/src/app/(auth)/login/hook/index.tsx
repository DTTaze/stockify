import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ACCESS_TOKEN } from "@/constants/auth";
import { handleShowMessage } from "@/helpers/error-code";
import { signInWithCredentialHandlers } from "@/services/auth/authHandlers";
import { LoginFormPayload } from "@/types/auth/auth.payload";

import { userFormSchema } from "../validationSchema";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormPayload>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormPayload) => {
    try {
      setLoading(true);

      const response = await signInWithCredentialHandlers(data);

      if (!response.success) {
        toast.error(handleShowMessage(response.code));
        return;
      }

      toast.success("Login success");

      cookieStore.set(ACCESS_TOKEN, response.data.accessToken);
      router.push("user/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
  };
}
