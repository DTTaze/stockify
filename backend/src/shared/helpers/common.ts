import { User } from '@modules/user/entities/user.entity';

export const extractUserInfo = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};

export const extractUniqueValues = <T>(data: T[], identifier: keyof T) => {
  return Array.from(new Set(data.map((item) => item[identifier] as string)));
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};
