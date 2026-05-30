import { ErrorType } from "@/types/common";

export const ACCESS_TOKEN = "accessToken";
export const ROLE = "role";
export const VERIFICATION_TOKEN_KEY = "token";

export const responseError: ErrorType[] = [
  // change password
  {
    errorCode: "password_same_as_old",
    message: "New password must be different from old password",
  },
  {
    errorCode: "old_password_incorrect",
    message: "Old password is incorrect",
  },

  // login
  {
    errorCode: "user_not_found",
    message: "User not found",
  },
  {
    errorCode: "account_suspended",
    message: "Account has been suspended",
  },
  {
    errorCode: "user_not_verified",
    message: "User is not verified",
  },
  {
    errorCode: "password_incorrect",
    message: "Password is incorrect",
  },
  {
    errorCode: "internal_server_error",
    message: "Internal server error",
  },
  {
    errorCode: "unauthorized",
    message: "Unauthorized",
  },
  {
    errorCode: "forbidden",
    message: "Forbidden",
  },
  {
    errorCode: "too_many_requests",
    message: "Too many requests",
  },

  // register
  {
    errorCode: "username_already_exists",
    message: "Username already exists",
  },
  {
    errorCode: "email_already_exists",
    message: "Email already exists",
  },

  // forgot password
  {
    errorCode: "not_found",
    message: "User not found",
  },

  // account status
  {
    errorCode: "account_deactivated",
    message: "Account is deactivated",
  },
];

export enum ROLE_NAME {
  USER = "user",
  ADMIN = "admin",
}
