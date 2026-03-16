import { createClient } from "@libsql/client";

const url = "libsql://ecommerce-haine-copii-metallicgroup.aws-us-east-2.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM1MTI1MTQsImlkIjoiMDE5Y2VkOTUtMjEwMS03ZGFmLThhNmMtMGI4YjlkMjhjZjZhIiwicmlkIjoiZTU2ZDA0MDctNjIzYi00NzdlLTljODktODRjYjIxNDEyZGRkIn0.9OglkChBqijguYdZpLcJ7dNDtwiaIEDxLXQqHk1qH2A62BmWarrZX3oIhLAr_AZtc0q-Zjr8gUVrPHg59QTNCQ";

const client = createClient({ url, authToken });

async function check() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Tables in Turso:", res.rows);
  } catch (error) {
    console.error("Error connecting to Turso:", error);
  }
}

check();
