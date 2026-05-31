import { getProfileHandlers } from "@/services/auth/authHandlers";
import { getUsersHandler } from "@/services/user/userHandlers";
import { AdminUserItem, ProfileType } from "@/types/user/user.type";

export const getProfileQueryFn = async (): Promise<ProfileType> => {
  const response = await getProfileHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch profile");
  }

  return response.data;
};

export const getUsersQueryFn = async (): Promise<AdminUserItem[]> => {
  const response = await getUsersHandler();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};
