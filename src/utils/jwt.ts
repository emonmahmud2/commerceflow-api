import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../constants/roles.js";

export type AccessPayload = { sub: string; role: Role };

const accessSignOptions: SignOptions = {
  expiresIn: env.accessTokenExpiresIn as SignOptions["expiresIn"],
};

const refreshSignOptions: SignOptions = {
  expiresIn: env.refreshTokenExpiresIn as SignOptions["expiresIn"],
};

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, accessSignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessPayload;
}

export function signRefreshToken(payload: { sub: string }): string {
  return jwt.sign(payload, env.jwtRefreshSecret, refreshSignOptions);
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.jwtRefreshSecret) as { sub: string };
}
