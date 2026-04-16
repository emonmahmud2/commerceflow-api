import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ROLES } from "../constants/roles.js";
import { User } from "../models/index.js";
import { hashPassword } from "../utils/hash.js";

function readRequired(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function seedAdmin() {
  const adminEmail = readRequired("ADMIN_EMAIL").toLowerCase();
  const adminPassword = readRequired("ADMIN_PASSWORD");
  const adminName = process.env.ADMIN_NAME?.trim() || "System Admin";

  await mongoose.connect(env.mongoUri);

  try {
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      let changed = false;

      if (existing.role !== ROLES.ADMIN) {
        existing.role = ROLES.ADMIN;
        changed = true;
      }

      if (existing.name !== adminName) {
        existing.name = adminName;
        changed = true;
      }

      const passwordHash = await hashPassword(adminPassword);
      existing.passwordHash = passwordHash;
      changed = true;

      if (changed) {
        await existing.save();
        console.log(`Updated existing admin user: ${adminEmail}`);
      } else {
        console.log(`Admin already up to date: ${adminEmail}`);
      }
      return;
    }

    const passwordHash = await hashPassword(adminPassword);
    await User.create({
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: ROLES.ADMIN,
    });

    console.log(`Admin created successfully: ${adminEmail}`);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed admin", error);
    process.exit(1);
  });
