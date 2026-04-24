"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { logout } from "@/helpers/logout";

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();

    router.push("/");
  }, [router]);

  return { handleLogout };
};
