"use client";

import { useCallback } from "react";

import { logout } from "@/helpers/logout";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();

    router.push("/");
  }, [router]);

  return { handleLogout };
};
