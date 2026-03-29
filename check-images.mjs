import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function check() {
  console.log("Checking last 20 products images data...");
  const res = await client.execute("SELECT id, name, images FROM Product ORDER BY createdAt DESC LIMIT 20;");
  
  for (const row of res.rows) {
    try {
      JSON.parse(row.images);
      console.log(`[OK] ${row.name}`);
    } catch(e) {
      console.error(`[FAIL] ${row.name} - Invalid JSON: "${row.images}"`);
    }
  }

  process.exit(0);
}

check();
