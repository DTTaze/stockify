import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ACCESS_TOKEN, ROLE, ROLE_NAME } from "@/constants/auth";
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

      const roles = response.data.user.roles || [];

      setCookie(ACCESS_TOKEN, response.data.accessToken);
      setCookie(ROLE, roles.join(","));

      toast.success("Login success");

      // ưu tiên admin
      if (roles.includes(ROLE_NAME.ADMIN)) {
        router.replace("/admin/dashboard");
        return;
      }

      if (roles.includes(ROLE_NAME.USER)) {
        router.replace("/user/dashboard");
        return;
      }

      router.replace("/");
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
