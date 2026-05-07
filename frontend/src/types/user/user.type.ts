import { ROLE_NAME } from "@/constants/auth";

export interface ProfileType {
  id: string;
  username: string;
  email: string;
  roles: ROLE_NAME[];
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}

export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
