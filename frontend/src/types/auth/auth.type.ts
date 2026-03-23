/* eslint-disable no-unused-vars */
export enum SocialAuthEnum {
  SOCIAL_AUTH_ERROR = "SOCIAL_AUTH_ERROR",
  SOCIAL_AUTH_SUCCESS = "SOCIAL_AUTH_SUCCESS",
}

export interface UserType {
  id: string;
  username: string;
  email: string;
  userWalletAddress: string;
}
