import { ApiResponse } from "@/types/api";
import {
  RoleItem,
  UserPaginatedResponseType,
  UserQueryType,
  UserStatus,
} from "@/types/user/user.type";

import { userServices } from ".";

export const getUsersHandler = async (
  params: UserQueryType,
): Promise<ApiResponse<UserPaginatedResponseType>> => {
  const response = await userServices.getUsers(params);
  return response.data;
};

export const updateUserStatusHandler = async (
  id: string,
  status: UserStatus,
): Promise<ApiResponse<void>> => {
  const response = await userServices.updateUserStatus(id, status);
  return response.data;
};

export const resetUserPasswordHandler = async (
  id: string,
  password?: string,
): Promise<ApiResponse<void>> => {
  const response = await userServices.resetPassword(id, password);
  return response.data;
};

export const syncUserRolesHandler = async (
  userId: string,
  roleIds: string[],
): Promise<ApiResponse<void>> => {
  const response = await userServices.syncUserRoles(userId, roleIds);
  return response.data;
};

export const getAllRolesHandler = async (): Promise<
  ApiResponse<RoleItem[]>
> => {
  const response = await userServices.getAllRoles();
  return response.data;
};
