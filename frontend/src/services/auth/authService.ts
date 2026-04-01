import { AxiosResponse } from "axios";

import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginFormPayload,
  RegisterFormPayload,
} from "@/types/auth/auth.payload";

import axiosClient from "..";

export const authService = {
  signInWithCredentials: (formData: LoginFormPayload): Promise<AxiosResponse> =>
    axiosClient.post("/auth/login", formData),

  signUp: (formData: RegisterFormPayload): Promise<AxiosResponse> =>
    axiosClient.post("/auth/register", formData),

  forgotPassword: (formData: ForgotPasswordPayload): Promise<AxiosResponse> =>
    axiosClient.post("/auth/forgot-password", formData),

  getProfile: (): Promise<AxiosResponse> => axiosClient.get("/auth/whoami"),

  changePassword: (data: ChangePasswordPayload): Promise<AxiosResponse> =>
    axiosClient.post("/auth/change-password", data),
};
