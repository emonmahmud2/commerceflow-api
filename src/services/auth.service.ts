import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ROLES, type Role } from "../constants/roles.js";
import { AppError } from "../errors/AppError.js";
import { RefreshToken, User } from "../models/index.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { parseExpiresToMs } from "../utils/expires.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export async function register(input: {
  email: string;
  password: string;
  name: string;
}) {
  const exists = await User.findOne({ email: input.email });
  if (exists) throw new AppError(409, "Email already registered");

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    email: input.email,
    passwordHash,
    name: input.name,
    role: ROLES.CUSTOMER,
  });

  return issueTokens(user._id.toString(), user.role);
}

export async function login(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email });
  if (!user) throw new AppError(401, "Invalid email or password");

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) throw new AppError(401, "Invalid email or password");

  return issueTokens(user._id.toString(), user.role);
}

async function issueTokens(userId: string, role: Role) {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });

  const expiresAt = new Date(
    Date.now() + parseExpiresToMs(env.refreshTokenExpiresIn)
  );

  await RefreshToken.create({
    userId: new mongoose.Types.ObjectId(userId),
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

export async function refresh(input: { refreshToken: string }) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(input.refreshToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const stored = await RefreshToken.findOne({ token: input.refreshToken });
  if (!stored) throw new AppError(401, "Refresh token revoked or invalid");

  const user = await User.findById(payload.sub);
  if (!user) throw new AppError(401, "User not found");

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });

  return { accessToken };
}

export async function logout(input: { refreshToken: string }) {
  await RefreshToken.deleteOne({ token: input.refreshToken });
}
