import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function audit() {
  console.log("Auditing Order table...");
  const orderInfo = await client.execute("PRAGMA table_info(`Order`);");
  console.log("Order columns:", orderInfo.rows.map(r => r.name).join(", "));
  
  console.log("Auditing Product table...");
  const productInfo = await client.execute("PRAGMA table_info(`Product`);");
  console.log("Product columns:", productInfo.rows.map(r => r.name).join(", "));

  process.exit(0);
}

audit();
