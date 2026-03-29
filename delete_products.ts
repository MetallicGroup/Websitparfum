import { prisma } from './src/lib/prisma/client';

async function main() {
  console.log("Deleting all products...");
  const res = await prisma.product.deleteMany({});
  console.log(`Deleted ${res.count} products.`);
}

main()
  .catch(e => console.error(e));
