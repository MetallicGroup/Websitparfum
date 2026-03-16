import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
if (!tursoUrl && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL STARTUP ERROR: TURSO_DATABASE_URL is missing in Next.js production runtime!");
}

const adapter = new PrismaLibSql({
  url: tursoUrl || "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
