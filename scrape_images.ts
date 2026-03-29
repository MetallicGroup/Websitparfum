import { prisma } from './src/lib/prisma/client';

async function run() {
  console.log("Starting ULTRA-SECURE FAST image scraper targeting eMAG search redirects...");
  
  const products = await prisma.product.findMany({
    where: { images: { contains: 'placeholder' } }
  });
  
  console.log(`Found ${products.length} products to scrape...`);
  
  let count = 0;
  
  const processBatch = async (batch: any[]) => {
    await Promise.all(batch.map(async (p) => {
      const pnk = p.emagId;
      if (!pnk || pnk.length < 5) return;
      
      try {
        const resp = await fetch(`https://www.emag.ro/search/${pnk}`, {
           headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
           },
           redirect: 'follow'
        });
        
        // SECURE URL MATCH CHECK
        if (resp.ok && resp.url.includes(pnk)) {
           const html = await resp.text();
           const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
           if (match && match[1] && match[1].includes('http') && !match[1].includes('placeholder')) {
               await (prisma.product as any).update({
                 where: { id: p.id },
                 data: { images: JSON.stringify([match[1]]) }
               });
               count++;
           }
        }
      } catch (e) { }
    }));
  };

  const BATCH_SIZE = 15;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
    console.log(`Progress: Processed up to ${Math.min(i + BATCH_SIZE, products.length)} / ${products.length} (Saved: ${count})...`);
  }
  
  console.log(`Done! Successfully updated ${count} products with real images.`);
  process.exit(0);
}

run();
