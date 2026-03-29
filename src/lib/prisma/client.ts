import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL;

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  if (!dbUrl) {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
      console.warn("WARNING: DATABASE_URL is missing! Returning a mocked Prisma client for build compatibility.");
    }
    // Return a dummy client proxy that won't crash on most operations but will log errors if called
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        if (prop === '$on' || prop === '$connect' || prop === '$disconnect' || prop === '$use' || prop === '$extends') {
          return () => {};
        }
        return new Proxy(() => {}, {
          get: () => () => { 
             console.error(`Prisma error: Attempted to call "${String(prop)}" but DATABASE_URL is missing.`);
             return []; // Return empty array as default for findMany etc.
          },
          apply: () => {
             return [];
          }
        });
      }
    });
  }

  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
