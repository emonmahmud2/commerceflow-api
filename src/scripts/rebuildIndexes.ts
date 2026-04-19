import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User, RefreshToken } from "../models/index.js";

async function rebuildIndexes() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(env.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB");

    console.log("\n🔨 Rebuilding indexes for User collection...");
    await User.collection.dropIndexes();
    await User.syncIndexes();
    const userIndexes = await User.collection.indexes();
    console.log("✅ User indexes created:");
    userIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log("\n🔨 Rebuilding indexes for RefreshToken collection...");
    await RefreshToken.collection.dropIndexes();
    await RefreshToken.syncIndexes();
    const refreshTokenIndexes = await RefreshToken.collection.indexes();
    console.log("✅ RefreshToken indexes created:");
    refreshTokenIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log("\n✅ All indexes rebuilt successfully!");
    console.log(
      "\n📊 Performance tip: Run 'db.collection.getIndexes()' in MongoDB shell to verify"
    );
  } catch (error) {
    console.error("❌ Error rebuilding indexes:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    process.exit(0);
  }
}

rebuildIndexes();
