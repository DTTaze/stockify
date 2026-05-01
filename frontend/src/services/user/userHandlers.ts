import { AdminUserItem, UserStatus } from "@/types/user/user.type";

import { userServices } from ".";

export const getUsersHandler = async (): Promise<AdminUserItem[]> => {
  const data = (await userServices.getUsers()).data;
  if (!data.success) throw new Error(data.message);
  return data.data;
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
