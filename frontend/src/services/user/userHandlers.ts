import { ApiResponse } from "@/types/api";
import {
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
