import { ApiResponse } from "@/types/api";
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginFormPayload,
  RegisterFormPayload,
} from "@/types/auth/auth.payload";
import { AuthResponse } from "@/types/auth/auth.response";
import { ProfileType } from "@/types/user/user.type";

import { authService } from "./authService";

export const signInWithCredentialHandlers = async (
  data: LoginFormPayload,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await authService.signInWithCredentials(data);

  return response.data;
};

export const signUpHandlers = async (
  data: RegisterFormPayload,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await authService.signUp(data);

  return response.data;
};

export const forgotPasswordHandlers = async (
  data: ForgotPasswordPayload,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await authService.forgotPassword(data);

  return response.data;
};

export const getProfileHandlers = async (): Promise<
  ApiResponse<ProfileType>
> => {
  const response = await authService.getProfile();

  return response.data;
};

export const changePasswordHandlers = async (
  data: ChangePasswordPayload,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await authService.changePassword(data);

  return response.data;
};
