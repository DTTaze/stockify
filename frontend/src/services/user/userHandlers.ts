import { ApiResponse } from "@/types/api";
import { AdminUserItem, UserStatus } from "@/types/user/user.type";

import { userServices } from ".";

export const getUsersHandler = async (): Promise<
  ApiResponse<AdminUserItem[]>
> => {
  const response = await userServices.getUsers();
  return response.data;
};

export const updateUserStatusHandler = async (
  id: string,
  status: UserStatus,
): Promise<void> => {
  const response = await userServices.updateUserStatus(id, status);
  const data = response.data;
  if (!data.success) {
    throw new Error(data.message);
  }
};
