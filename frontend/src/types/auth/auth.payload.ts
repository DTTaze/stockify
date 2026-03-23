export enum SocialProviderEnum {
  // eslint-disable-next-line no-unused-vars
  GOOGLE = "google",
}

export interface LoginFormPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterFormPayload {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ChangePasswordFormPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeGmailFormPayload {
  email: string;
  reason?: string;
}

export interface PasscodeFormPayload {
  passcode: string;
  confirmPasscode: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword: string;
}

export interface UpdateAntiPhishingCodeFormPayload {
  oldAntiPhishingCode: string;
  newAntiPhishingCode: string;
}
