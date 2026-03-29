"use server"

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = "mariataralunga87@gmail.com";

/**
 * Utility to send order confirmation emails using Resend API.
 */
export async function sendOrderConfirmationEmail(orderData: any) {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return { success: false };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'KiddyShop <onboarding@resend.dev>', // Should be a verified domain in production
        to: orderData.customerEmail,
        subject: `Confirmare Comandă #${orderData.id.slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981;">Bună ${orderData.customerName},</h2>
            <p>Comanda ta a fost primită cu succes! Îți mulțumim că ai ales <strong>KiddyShop</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <p><strong>ID Comandă:</strong> #${orderData.id}</p>
              <p><strong>Total de plată:</strong> ${orderData.total.toFixed(2)} Lei</p>
            </div>
            <p style="margin-top: 20px;">Vei fi contactat în curând de echipa noastră pentru confirmare și livrare.</p>
            <p style="font-size: 14px; color: #666;">Dacă ai întrebări, ne poți contacta la ${ADMIN_EMAIL}.</p>
          </div>
        `
      })
    });

    const result = await response.json();
    return { success: result.id ? true : false };
  } catch (error) {
    console.error("Resend API Error (Customer):", error);
    return { success: false };
  }
}

export async function sendAdminOrderAlert(orderData: any) {
  if (!RESEND_API_KEY) return { success: false };

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'KiddyShop system <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🛒 COMANDĂ NOUĂ #${orderData.id.slice(-6).toUpperCase()}`,
        html: `
          <h3>Comandă nouă de la ${orderData.customerName}</h3>
          <p><strong>Valoare:</strong> ${orderData.total.toFixed(2)} Lei</p>
          <p><strong>Email client:</strong> ${orderData.customerEmail}</p>
          <p>Verifică panoul de administrare pentru detalii: <a href="https://magickidswear.ro/admin/orders">Comenzi Admin</a></p>
        `
      })
    });
    return { success: true };
  } catch (error) {
    console.error("Resend API Error (Admin):", error);
    return { success: false };
  }
}
