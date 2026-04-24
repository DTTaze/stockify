import { useQuery } from "@tanstack/react-query";

import { ProfileType } from "@/types/user/user.type";

import { getProfileQueryFn } from "./QueryFnsUser";
import { QueryKeysUser } from "./QueryKeysUser";

export const initialDataProfile: ProfileType = {
  id: "",
  email: "",
  username: "",
};

export const useQueryProfile = (isAuthenticated?: boolean) =>
  useQuery<ProfileType>({
    queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_PROFILE],
    queryFn: () => getProfileQueryFn(),
    placeholderData: initialDataProfile,
    staleTime: Infinity,
    enabled: !!isAuthenticated,
  });
