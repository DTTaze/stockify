import { deleteCookie } from "cookies-next/client";
import { toast } from "sonner";

import { ACCESS_TOKEN } from "@/constants/auth";
import { queryClient } from "@/lib/react-query/queryClient";
import { QueryKeysUser } from "@/queries/users/QueryKeysUser";
import { useAppStore } from "@/store/app/app";

export const clearCookies = () => {
  deleteCookie(ACCESS_TOKEN);
};

export const clearUserQueries = () => {
  queryClient.removeQueries({
    predicate: (query) => {
      const key = query.queryKey[0];

      return [QueryKeysUser.USER as string].includes(key as string);
    },
  });
};

export const clearZustand = () => {
  useAppStore.getState().dispatch({
    type: "RESET",
  });
};

export const logout = () => {
  try {
    clearCookies();

    clearUserQueries();

    clearZustand();

    // window.location.reload();
  } catch (error) {
    console.log(error);
    toast.error("Logout failed");
  }
};
