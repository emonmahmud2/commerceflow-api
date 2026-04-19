import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

async function main() {
  await mongoose.connect(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`Server http://localhost:${env.port}`);
    console.log(`Swagger   http://localhost:${env.port}/api-docs`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
