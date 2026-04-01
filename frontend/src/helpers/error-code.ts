import { responseError } from "@/constants/auth";

export const handleShowMessage = (errorCode: string) => {
  const findErrorCode = responseError.find(
    (item) => item.errorCode === errorCode,
  );

  if (!findErrorCode) return "unknownError";

  return findErrorCode.message;
};
