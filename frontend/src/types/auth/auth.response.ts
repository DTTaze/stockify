import { UserType } from "./auth.type";

export interface AuthResponse {
  accessToken: string;
  user: UserType;
}
