import { AppError } from "../errors/AppError.js";
import { User } from "../models/index.js";
import { hashPassword } from "../utils/hash.js";

export async function getMe(userId: string) {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) throw new AppError(404, "User not found");
  return user;
}

export async function updateMe(
  userId: string,
  input: { name?: string; password?: string }
) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  if (input.name !== undefined) user.name = input.name;
  if (input.password !== undefined) {
    user.passwordHash = await hashPassword(input.password);
  }

  await user.save();
  return User.findById(userId).select("-passwordHash");
}
