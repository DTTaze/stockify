export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
export const strictEmailRegex =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9\.]{0,29})@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/; // Strict email validation, max 30 chars before @
export const passwordLengthRegex = /^.{8,16}$/; // 8-16 characters
export const passwordUppercaseRegex = /(?=.*[A-Z])/; // At least one uppercase letter
export const passwordLowercaseRegex = /(?=.*[a-z])/; // At least one lowercase letter
export const passwordNumberRegex = /(?=.*\d)/; // At least one number
export const passwordSpecialCharRegex =
  /(?=.*[!@#$%^&*(),.?":{}|<>[\]\\\/`~_\-+=;'’])/; //At least 1 special character
export const commaRegex = /\B(?=(\d{3})+(?!\d))/g;
export const numberRegex = /^[0-9.,]*$/;
export const usernameRegex = /^[a-zA-Z0-9]+$/;
export const accountNameRegex = /^[a-zA-Z0-9À-ỹ._\s-@]*$/;

export const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export const nameRegex = /^[A-Za-zÀ-ỹ\s'-]+$/;
export const addressRegex = /^[A-Za-z0-9À-ỹ\s,'-]+$/;
export const cityRegex = /^[A-Za-zÀ-ỹ\s'-]+$/;
export const phoneRegex = /^[0-9]{8,15}$/;

export const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;
