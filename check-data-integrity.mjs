import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function check() {
  console.log("Checking last 20 products price/stock data...");
  const res = await client.execute("SELECT id, name, price, stock FROM Product ORDER BY createdAt DESC LIMIT 20;");
  
  for (const row of res.rows) {
    if (row.price === null || row.price === undefined) {
      console.log(`[FAIL] ${row.name} - Price is NULL`);
    } else if (row.stock === null || row.stock === undefined) {
      console.log(`[FAIL] ${row.name} - Stock is NULL`);
    } else {
      console.log(`[OK] ${row.name} - Price: ${row.price}, Stock: ${row.stock}`);
    }
  }

  process.exit(0);
}

check();
