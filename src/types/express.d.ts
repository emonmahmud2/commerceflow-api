import type { Role } from "../constants/roles.js";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      role: Role;
    }
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export {};
