import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const categoriesCount = await prisma.category.count();
    const productsCount = await prisma.product.count();
    const categories = await prisma.category.findMany();
    
    console.log("Categories Count:", categoriesCount);
    console.log("Products Count:", productsCount);
    console.log("Categories Slugs:", categories.map(c => c.slug).join(", "));
    
  } catch (error) {
    console.error("Check error:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

check();
