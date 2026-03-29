import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO env vars");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function fix() {
  console.log("Adding stripePaymentIntentId column to Order table...");
  try {
    await client.execute("ALTER TABLE `Order` ADD COLUMN `stripePaymentIntentId` TEXT;");
    console.log("Column added successfully!");
  } catch (e) {
    if (e.message.includes("duplicate column name")) {
      console.log("Column already exists.");
    } else {
      console.error("Error adding column:", e.message);
    }
  }

  // Also ensuring OrderStatus enum equivalents are handled if status changed
  // In SQLite, status is just a TEXT field usually, so no enum to update.
  
  process.exit(0);
}

fix();
