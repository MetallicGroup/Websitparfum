"use server"

/**
 * Utility to send order confirmation emails.
 * Real implementation would use Nodemailer or Resend.
 */
export async function sendOrderConfirmationEmail(orderData: any) {
  console.log(`[EMAIL SIMULATION] Sending confirmation to ${orderData.customerEmail}`);
  console.log(`Order ID: ${orderData.id}`);
  console.log(`Total: ${orderData.total} Lei`);
  
  // In a real implementation:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'KiddyShop <comenzi@kiddyshop.ro>',
    to: orderData.customerEmail,
    subject: `Confirmare Comandă #${orderData.id.slice(-6).toUpperCase()}`,
    html: `<p>Bună ${orderData.customerName},</p><p>Comanda ta a fost primită!</p>...`
  });
  */
  
  return { success: true };
}

export async function sendAdminOrderAlert(orderData: any) {
  console.log(`[EMAIL SIMULATION] Sending admin alert for new order ${orderData.id}`);
  return { success: true };
}
