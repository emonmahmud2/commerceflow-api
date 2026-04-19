import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

async function main() {
  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 50,
    minPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
  });

  console.log("MongoDB connected with optimized pool settings");

  app.listen(env.port, () => {
    console.log(`Server http://localhost:${env.port}`);
    console.log(`Swagger   http://localhost:${env.port}/api-docs`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
