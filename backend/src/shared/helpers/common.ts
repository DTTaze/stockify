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
