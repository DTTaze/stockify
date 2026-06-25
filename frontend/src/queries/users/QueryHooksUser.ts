import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { signUpHandlers } from "@/services/auth/authHandlers";
import {
  getAllRolesHandler,
  resetUserPasswordHandler,
  syncUserRolesHandler,
  updateUserStatusHandler,
} from "@/services/user/userHandlers";
import { RegisterFormPayload } from "@/types/auth/auth.payload";
import {
  ProfileType,
  RoleItem,
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

export const useQueryAllRoles = () =>
  useQuery<RoleItem[]>({
    queryKey: [QueryKeysUser.USER, "all-roles"],
    queryFn: async () => {
      const response = await getAllRolesHandler();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch roles");
      }
      return response.data || [];
    },
  });

interface SyncUserRolesParams {
  userId: string;
  roleIds: string[];
}

export const useMutateSyncUserRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleIds }: SyncUserRolesParams) => {
      const response = await syncUserRolesHandler(userId, roleIds);
      if (!response.success) {
        throw new Error(response.message || "Failed to sync roles");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST],
      });
    },
  });
};

interface ResetUserPasswordParams {
  id: string;
  password?: string;
}

export const useMutateResetUserPassword = () =>
  useMutation({
    mutationFn: async ({ id, password }: ResetUserPasswordParams) => {
      const response = await resetUserPasswordHandler(id, password);
      if (!response.success) {
        throw new Error(response.message || "Failed to reset password");
      }
    },
  });

export const useMutateCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterFormPayload) => {
      const response = await signUpHandlers(data);
      if (!response.success) {
        throw new Error(response.message || "Failed to create user");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysUser.USER, QueryKeysUser.USER_LIST],
      });
    },
  });
};
