import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL;

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  if (!dbUrl) {
    if (process.env.NODE_ENV === "production") {
      console.warn("WARNING: DATABASE_URL is missing in production!");
    }
    return new PrismaClient(); // Fallback to standard client might still fail but won't crash at import
  }

  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
