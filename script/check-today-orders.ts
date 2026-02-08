import { storage } from '../server/storage.js';

async function checkTodayOrders() {
  try {
    const allOrders = await storage.getAllOrders();
    
    // Get today's date (start of day) in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter orders from today
    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
    
    console.log('\n=== COMENZI ASTĂZI ===\n');
    console.log(`Total comenzi astăzi: ${todayOrders.length}\n`);
    
    if (todayOrders.length === 0) {
      console.log('Nu s-au dat comenzi astăzi.\n');
      return;
    }
    
    todayOrders.forEach((order, index) => {
      console.log(`${index + 1}. Comandă #${order.id.slice(0, 8)}`);
      console.log(`   Nume: ${order.customerName}`);
      console.log(`   Telefon: ${order.phoneNumber}`);
      if (order.email) {
        console.log(`   Email: ${order.email}`);
      }
      console.log(`   Adresă: ${order.address}, ${order.city}, ${order.county}`);
      console.log(`   Total: ${order.grandTotal} Lei`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Data: ${new Date(order.createdAt).toLocaleString('ro-RO')}`);
      console.log(`   Produse:`);
      order.products.forEach((product) => {
        console.log(`      - ${product.quantity}x ${product.name} (${product.price} Lei)`);
      });
      console.log('');
    });
    
    const totalValue = todayOrders.reduce((sum, order) => sum + order.grandTotal, 0);
    console.log(`\nValoare totală comenzi astăzi: ${totalValue.toFixed(2)} Lei\n`);
    
  } catch (error) {
    console.error('Eroare la interogarea comenzilor:', error);
  } finally {
    process.exit(0);
  }
}

checkTodayOrders();
