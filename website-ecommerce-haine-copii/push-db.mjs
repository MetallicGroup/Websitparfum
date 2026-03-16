import { createClient } from "@libsql/client";
import fs from "fs";

const url = "libsql://ecommerce-haine-copii-metallicgroup.aws-us-east-2.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM1MTI1MTQsImlkIjoiMDE5Y2VkOTUtMjEwMS03ZGFmLThhNmMtMGI4YjlkMjhjZjZhIiwicmlkIjoiZTU2ZDA0MDctNjIzYi00NzdlLTljODktODRjYjIxNDEyZGRkIn0.9OglkChBqijguYdZpLcJ7dNDtwiaIEDxLXQqHk1qH2A62BmWarrZX3oIhLAr_AZtc0q-Zjr8gUVrPHg59QTNCQ";

const client = createClient({ url, authToken });

async function push() {
  console.log("Reading dump.sql...");
  let sql = fs.readFileSync("dump.sql", "utf8");
  
  // Remove transaction commands as libSQL handles auto-commit or explicit transactions differently
  sql = sql.replace(/BEGIN TRANSACTION;/g, "");
  sql = sql.replace(/COMMIT;/g, "");
  
  console.log("Executing SQL on Turso...");
  try {
    await client.executeMultiple(sql);
    console.log("Success! Database pushed to Turso.");
  } catch(e) {
    console.error("Error executing SQL:", e);
  }
}

push();
