import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { updateUserStatusHandler } from "@/services/user/userHandlers";
import { AdminUserItem, ProfileType, UserStatus } from "@/types/user/user.type";

import { getUsersQueryFn, getProfileQueryFn } from "./QueryFnsUser";
import { QueryKeysUser } from "./QueryKeysUser";

export const initialDataProfile: ProfileType = {
  id: "",
  email: "",
  username: "",
  roles: [],
};

export const useQueryProfile = (isAuthenticated?: boolean) =>
  useQuery<ProfileType>({
    queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_PROFILE],
    queryFn: () => getProfileQueryFn(),
    placeholderData: initialDataProfile,
    staleTime: Infinity,
    enabled: !!isAuthenticated,
  });

export const useQueryAdminUsers = () =>
  useQuery<AdminUserItem[]>({
    queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST],
    queryFn: getUsersQueryFn,
  });

export const useMutateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatusHandler(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST],
        exact: true,
      });
    },
  });
};
