import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: [ROLES.CUSTOMER, ROLES.ADMIN],
      default: ROLES.CUSTOMER,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
