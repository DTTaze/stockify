import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { updateUserStatusHandler } from "@/services/user/userHandlers";
import {
  ProfileType,
  UserPaginatedResponseType,
  UserQueryType,
  UserStatus,
} from "@/types/user/user.type";

import { getProfileQueryFn, getUsersQueryFn } from "./QueryFnsUser";
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

export const useQueryAdminUsers = (params: UserQueryType) =>
  useQuery<UserPaginatedResponseType>({
    queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST, params],
    queryFn: () => getUsersQueryFn(params),
  });

interface UpdateUserStatusParams {
  id: string;
  status: UserStatus;
}

export const useMutateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: UpdateUserStatusParams) => {
      const response = await updateUserStatusHandler(id, status);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST],
      });
    },
  });
};
