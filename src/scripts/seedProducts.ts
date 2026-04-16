import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Product } from "../models/index.js";

type SeedProduct = {
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
};

const seedProducts: SeedProduct[] = [
  { name: "Wireless Mouse", price: 1200, stock: 45, isActive: true },
  { name: "Mechanical Keyboard", price: 4800, stock: 25, isActive: true },
  { name: "27-inch Monitor", price: 22500, stock: 12, isActive: true },
  { name: "USB-C Hub", price: 1800, stock: 40, isActive: true },
  { name: "Laptop Stand", price: 2300, stock: 30, isActive: true },
  { name: "Noise Cancelling Headphones", price: 9800, stock: 18, isActive: true },
  { name: "Webcam 1080p", price: 3500, stock: 22, isActive: true },
  { name: "Portable SSD 1TB", price: 11200, stock: 15, isActive: true },
  { name: "Power Bank 20000mAh", price: 2700, stock: 28, isActive: true },
  { name: "Gaming Chair", price: 16500, stock: 8, isActive: true },
  { name: "Smartwatch", price: 7400, stock: 20, isActive: true },
  { name: "Bluetooth Speaker", price: 3200, stock: 26, isActive: true },
  { name: "Desk Lamp", price: 1400, stock: 35, isActive: true },
  { name: "Tablet 10-inch", price: 18800, stock: 10, isActive: true },
  { name: "Wireless Charger", price: 1600, stock: 32, isActive: true },
];

function shouldResetProducts(): boolean {
  return (
    process.argv.includes("--reset") ||
    String(process.env.SEED_PRODUCTS_RESET).toLowerCase() === "true"
  );
}

async function seed() {
  await mongoose.connect(env.mongoUri);

  try {
    if (shouldResetProducts()) {
      const resetResult = await Product.deleteMany({});
      console.log(`Cleared products: ${resetResult.deletedCount ?? 0}`);
    }

    const operations = seedProducts.map((item) => ({
      updateOne: {
        filter: { name: item.name },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);

    console.log(`Seed completed with ${seedProducts.length} products.`);
    console.log(
      `Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Matched: ${result.matchedCount}`
    );
  } finally {
    await mongoose.disconnect();
  }
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed products", error);
    process.exit(1);
  });
