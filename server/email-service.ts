/**
 * Email service for sending order confirmations
 */

import nodemailer from 'nodemailer';
import { getProductById, products as serverProducts } from './products';
import type { Order } from '@shared/schema';

// Get base URL from environment or use default
const BASE_URL = process.env.BASE_URL || 'https://luxeparfum.store';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'danudda2810@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'danudda2810@gmail.com';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
});

/**
 * Get full image URL for a product
 * Uses image path from order if available, otherwise constructs from product name
 */
function getProductImageUrl(productId: string, productName: string, imagePath?: string): string {
  // If image path is provided in order, use it
  if (imagePath) {
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it starts with /, it's a relative path
    if (imagePath.startsWith('/')) {
      return `${BASE_URL}${imagePath}`;
    }
    // Otherwise, assume it's relative to products folder
    return `${BASE_URL}/products/Parfumatica_Main_Photos/${imagePath}`;
  }
  
  // Fallback: construct URL from product name
  // This is a best-guess approach
  const imagePathFallback = `/products/Parfumatica_Main_Photos/${encodeURIComponent(productName)}.jpg`;
  return `${BASE_URL}${imagePathFallback}`;
}

/**
 * Generate customer confirmation email HTML
 */
function generateCustomerEmailHTML(order: Order): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const productsHTML = order.products.map((product, index) => {
    // Get image path from product if available (from order.products)
    const productImage = getProductImageUrl(
      product.id, 
      product.name,
      (product as any).image // Type assertion since image might not be in schema yet
    );
    const productInfo = getProductById(product.id);
    
    return `
      <tr>
        <td style="padding: 20px; border-bottom: 1px solid #eee;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="120" valign="top">
                <img src="${productImage}" alt="${product.name}" style="width: 100px; height: auto; border-radius: 8px; object-fit: contain;" />
              </td>
              <td valign="top" style="padding-left: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-family: 'Playfair Display', serif;">
                  ${product.name}
                </h3>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                  Cantitate: <strong>${product.quantity}</strong>
                </p>
                <p style="margin: 5px 0; color: #333; font-size: 16px; font-weight: bold;">
                  ${product.price} Lei / bucată
                </p>
                <p style="margin: 5px 0; color: #333; font-size: 18px; font-weight: bold; color: #d4af37;">
                  Total: ${product.price * product.quantity} Lei
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare Comandă - Luxe Parfum</title>
  <style>
    body {
      font-family: 'Montserrat', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #fff;
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .content {
      padding: 40px 30px;
    }
    .order-info {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-info h2 {
      margin-top: 0;
      color: #d4af37;
      font-family: 'Playfair Display', serif;
      font-size: 24px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #666;
      font-weight: 500;
    }
    .info-value {
      color: #333;
      font-weight: bold;
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .total-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 16px;
    }
    .grand-total {
      font-size: 24px;
      font-weight: bold;
      color: #d4af37;
      border-top: 2px solid #d4af37;
      padding-top: 10px;
      margin-top: 10px;
    }
    .footer {
      background-color: #333;
      color: #fff;
      padding: 30px;
      text-align: center;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background-color: #4caf50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Comandă Confirmată! ✨</h1>
    </div>
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <div class="success-icon">✓</div>
        <h2 style="color: #4caf50; margin: 0;">Mulțumim pentru comandă!</h2>
        <p style="color: #666; margin-top: 10px;">
          Comanda ta a fost înregistrată cu succes și va fi procesată în cel mai scurt timp.
        </p>
      </div>

      <div class="order-info">
        <h2>Detalii Comandă</h2>
        <div class="info-row">
          <span class="info-label">Număr comandă:</span>
          <span class="info-value">#${order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data comenzii:</span>
          <span class="info-value">${orderDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value" style="color: #4caf50;">Confirmată</span>
        </div>
      </div>

      <h2 style="font-family: 'Playfair Display', serif; color: #333; margin-top: 40px;">
        Produse comandate
      </h2>
      <table class="products-table">
        ${productsHTML}
      </table>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal produse:</span>
          <span><strong>${order.total} Lei</strong></span>
        </div>
        <div class="total-row">
          <span>Cost livrare:</span>
          <span><strong>${order.shippingCost === 0 ? 'GRATUIT' : `${order.shippingCost} Lei`}</strong></span>
        </div>
        <div class="total-row grand-total">
          <span>Total de plată:</span>
          <span>${order.grandTotal} Lei</span>
        </div>
      </div>

      <div class="order-info" style="margin-top: 30px;">
        <h2>Date Livrare</h2>
        <div class="info-row">
          <span class="info-label">Nume:</span>
          <span class="info-value">${order.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefon:</span>
          <span class="info-value">${order.phoneNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Adresă:</span>
          <span class="info-value">${order.address}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Oraș:</span>
          <span class="info-value">${order.city}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Județ:</span>
          <span class="info-value">${order.county}</span>
        </div>
      </div>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; color: #856404;">
          <strong>ℹ️ Informații importante:</strong><br>
          • Vei fi contactat în curând pentru confirmarea comenzii<br>
          • Plata se va face ramburs la curier (cash)<br>
          • Livrarea se face în 2-3 zile lucrătoare<br>
          • Pentru întrebări, ne poți contacta pe WhatsApp
        </p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>Luxe Parfum</strong><br>
        Parfumuri de lux autentice
      </p>
      <p style="margin: 10px 0; font-size: 12px;">
        <a href="${BASE_URL}">${BASE_URL.replace('https://', '').replace('http://', '')}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate admin notification email HTML
 */
function generateAdminEmailHTML(order: Order): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const productsHTML = order.products.map((product) => {
    // Get image path from product if available
    const productImage = getProductImageUrl(
      product.id, 
      product.name,
      (product as any).image // Type assertion since image might not be in schema yet
    );
    
    return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="100" valign="top">
                <img src="${productImage}" alt="${product.name}" style="width: 80px; height: auto; border-radius: 4px; object-fit: contain;" />
              </td>
              <td valign="top" style="padding-left: 15px;">
                <p style="margin: 0 0 5px 0; color: #333; font-size: 16px; font-weight: bold;">
                  ${product.name}
                </p>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                  ${product.quantity} x ${product.price} Lei = <strong>${product.price * product.quantity} Lei</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouă Comandă - Luxe Parfum</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 700px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      padding: 30px 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-section {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #666;
      font-weight: 500;
    }
    .info-value {
      color: #333;
      font-weight: bold;
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .total-box {
      background-color: #e7f3ff;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: right;
    }
    .grand-total {
      font-size: 24px;
      font-weight: bold;
      color: #dc3545;
      margin-top: 10px;
    }
    .footer {
      background-color: #333;
      color: #fff;
      padding: 20px;
      text-align: center;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 NOUĂ COMANDĂ</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>⚠️ Acțiune necesară:</strong> O nouă comandă a fost plasată și necesită procesare.
      </div>

      <div class="info-section">
        <h2 style="margin-top: 0; color: #dc3545;">Informații Comandă</h2>
        <div class="info-row">
          <span class="info-label">Număr comandă:</span>
          <span class="info-value">#${order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data și ora:</span>
          <span class="info-value">${orderDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value" style="color: #ffc107;">Pending</span>
        </div>
      </div>

      <div class="info-section">
        <h2 style="margin-top: 0; color: #333;">Date Client</h2>
        <div class="info-row">
          <span class="info-label">Nume:</span>
          <span class="info-value">${order.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefon:</span>
          <span class="info-value"><a href="tel:${order.phoneNumber}">${order.phoneNumber}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Adresă completă:</span>
          <span class="info-value">${order.address}, ${order.city}, ${order.county}</span>
        </div>
      </div>

      <h2 style="color: #333; margin-top: 30px;">Produse comandate</h2>
      <table class="products-table">
        ${productsHTML}
      </table>

      <div class="total-box">
        <div style="margin-bottom: 10px;">
          <span>Subtotal produse: </span>
          <strong>${order.total} Lei</strong>
        </div>
        <div style="margin-bottom: 10px;">
          <span>Cost livrare: </span>
          <strong>${order.shippingCost === 0 ? 'GRATUIT' : `${order.shippingCost} Lei`}</strong>
        </div>
        <div class="grand-total">
          TOTAL: ${order.grandTotal} Lei
        </div>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">Luxe Parfum - Sistem de notificare automată</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send customer confirmation email
 */
export async function sendCustomerConfirmationEmail(
  order: Order,
  customerEmail?: string
): Promise<{ success: boolean; error?: string }> {
  if (!customerEmail) {
    console.log('No customer email provided, skipping email');
    return { success: true };
  }

  if (!SMTP_USER || !SMTP_PASS) {
    console.log('SMTP not configured, skipping email');
    return { success: true };
  }

  try {
    const html = generateCustomerEmailHTML(order);
    
    await transporter.sendMail({
      from: `"Luxe Parfum" <${SMTP_USER}>`,
      to: customerEmail,
      subject: `✨ Comandă Confirmată #${order.id.slice(0, 8).toUpperCase()} - Luxe Parfum`,
      html,
    });

    console.log(`Customer confirmation email sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(
  order: Order
): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_EMAIL) {
    console.log('No admin email configured, skipping admin notification');
    return { success: true };
  }

  if (!SMTP_USER || !SMTP_PASS) {
    console.log('SMTP not configured, skipping email');
    return { success: true };
  }

  try {
    const html = generateAdminEmailHTML(order);
    
    await transporter.sendMail({
      from: `"Luxe Parfum System" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Nouă Comandă #${order.id.slice(0, 8).toUpperCase()} - ${order.customerName}`,
      html,
    });

    console.log(`Admin notification email sent to ${ADMIN_EMAIL}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
