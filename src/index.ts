import mongoose from "mongoose";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

async function main() {
  await mongoose.connect(env.mongoUri);

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server http://localhost:${env.port}`);
    console.log(`Swagger   http://localhost:${env.port}/api-docs`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
