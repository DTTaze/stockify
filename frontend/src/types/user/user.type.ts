export interface ProfileType {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export type UserStatus = "active" | "suspended" | "inactive";

export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
