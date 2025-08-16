import { IUser, User } from "./user.model";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const doesUserExist = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return !!user;
};
