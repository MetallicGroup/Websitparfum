import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema, insertLeadSchema, type Order, type ConversationState } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { searchProducts, getProductById, getProductsByCategory, type Product } from "./products";
import { sendTikTokPurchaseEvent } from "./tiktok-events-api";
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from "./email-service";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PHONE = process.env.ADMIN_PHONE_NUMBER?.split(',')[0]?.trim() || "";
const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 250;

let adminWss: WebSocketServer;
let visitorWss: WebSocketServer;
const adminClients: Set<WebSocket> = new Set();

interface Visitor {
  id: string;
  page: string;
  lastAction: string;
  lastActionTime: Date;
  connectedAt: Date;
  device: string;
}

const activeVisitors: Map<WebSocket, Visitor> = new Map();

function broadcastToAdmins(data: any) {
  const message = JSON.stringify(data);
  adminClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastOrder(order: Order) {
  broadcastToAdmins({ type: "new_order", order });
}

function broadcastVisitors() {
  const visitors = Array.from(activeVisitors.values());
  broadcastToAdmins({ type: "visitors_update", visitors, count: visitors.length });
}

async function sendWhatsAppMessage(to: string, templateName: string, parameters: string[]) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error("WhatsApp credentials not configured");
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "ro"
            },
            components: [
              {
                type: "body",
                parameters: parameters.map(text => ({ type: "text", text }))
              }
            ]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`WhatsApp API error: ${response.status}`, errorData);
    } else {
      const data = await response.json();
      console.log("WhatsApp message sent:", data);
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

async function sendBazaTemplate(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return { success: false, error: "WhatsApp credentials not configured" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: "baza",
            language: {
              code: "ro"
            }
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`WhatsApp API error for baza template: ${response.status}`, errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();
    console.log("Baza template sent:", data);
    const messageId = data.messages?.[0]?.id;
    return { success: true, messageId };
  } catch (error) {
    console.error("Error sending baza template:", error);
    return { success: false, error: String(error) };
  }
}

async function sendTextMessage(to: string, text: string): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error("WhatsApp credentials not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: text }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`WhatsApp text message error: ${response.status}`, errorData);
      return false;
    }

    console.log(`Text message sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending text message:", error);
    return false;
  }
}

async function handleChatbotMessage(from: string, messageText: string, buttonPayload?: string): Promise<void> {
  console.log(`Chatbot: Processing message from ${from}: "${messageText || buttonPayload}"`);
  
  let conversation = await storage.getConversation(from);
  
  if (buttonPayload === "VEZI_PARFUMURILE" || buttonPayload?.includes("PARFUM")) {
    await storage.upsertConversation(from, { state: "awaiting_search", cart: [], searchResults: [] });
    await sendTextMessage(from, 
      "🌸 Bine ai venit la Luxe Parfum!\n\n" +
      "Ce parfum cauți? Poți să-mi scrii:\n" +
      "• Numele parfumului (ex: Dior Sauvage)\n" +
      "• Tipul (scrie 'dama', 'barbati' sau 'unisex')\n\n" +
      "✨ Toate parfumurile noastre sunt originale și la prețuri speciale!"
    );
    return;
  }

  if (!conversation) {
    conversation = await storage.upsertConversation(from, { state: "awaiting_search", cart: [], searchResults: [] });
  }

  const state = conversation.state;
  const text = messageText.toLowerCase().trim();

  switch (state) {
    case "awaiting_search":
    case "idle": {
      let results: Product[] = [];
      let header = "";
      
      if (text === "dama" || text === "femei" || text === "women") {
        results = getProductsByCategory("women");
        header = "Parfumuri damă populare:";
      } else if (text === "barbati" || text === "barbat" || text === "men") {
        results = getProductsByCategory("men");
        header = "Parfumuri bărbați populare:";
      } else if (text === "unisex") {
        results = getProductsByCategory("unisex");
        header = "Parfumuri unisex populare:";
      } else {
        results = searchProducts(messageText);
        if (results.length > 0) {
          header = `Am găsit ${results.length} rezultate pentru "${messageText}":`;
        }
      }
      
      if (results.length > 0) {
        const searchResultsToStore = results.map(p => ({ id: p.id, name: p.name, price: p.price }));
        await storage.upsertConversation(from, { state: "awaiting_selection", searchResults: searchResultsToStore });
        await sendProductResults(from, results, header);
      } else {
        await sendTextMessage(from, 
          `😔 Din păcate, nu am găsit "${messageText}" în stoc.\n\n` +
          "Am notat cererea ta și te vom contacta dacă devine disponibil!\n\n" +
          "Între timp, poți căuta alt parfum sau scrie 'dama', 'barbati' sau 'unisex' pentru a vedea opțiunile disponibile."
        );
        await notifyAdminMissingProduct(from, messageText);
      }
      break;
    }

    case "awaiting_selection": {
      const productNum = parseInt(text);
      const storedResults = conversation.searchResults || [];
      
      if (!isNaN(productNum) && productNum >= 1 && productNum <= storedResults.length) {
        const selectedProduct = storedResults[productNum - 1];
        if (selectedProduct) {
          const cart = [{ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, quantity: 1 }];
          await storage.upsertConversation(from, { state: "awaiting_quantity", cart, searchResults: [] });
          await sendTextMessage(from, 
            `✨ Ai ales: ${selectedProduct.name}\n` +
            `💰 Preț: ${selectedProduct.price} lei\n\n` +
            "Câte bucăți dorești? (scrie un număr de la 1 la 5)"
          );
          return;
        }
      }
      await sendTextMessage(from, `Te rog să scrii un număr de la 1 la ${storedResults.length} pentru a selecta parfumul dorit.`);
      break;
    }

    case "awaiting_quantity": {
      const quantity = parseInt(text);
      if (!isNaN(quantity) && quantity >= 1 && quantity <= 5) {
        const cart = [...(conversation.cart || [])];
        if (cart.length > 0) {
          cart[0].quantity = quantity;
          const total = cart[0].price * quantity;
          const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
          
          await storage.upsertConversation(from, { state: "awaiting_name", cart });
          await sendTextMessage(from, 
            `📦 Comanda ta:\n` +
            `${quantity}x ${cart[0].name} = ${total} lei\n` +
            `🚚 Livrare: ${shipping === 0 ? "GRATUITĂ" : `${shipping} lei`}\n` +
            `💳 Total: ${total + shipping} lei\n\n` +
            "Plata se face la livrare (ramburs).\n\n" +
            "Pentru a finaliza comanda, te rog să-mi spui numele tău complet:"
          );
        }
      } else {
        await sendTextMessage(from, "Te rog să scrii un număr de la 1 la 5.");
      }
      break;
    }

    case "awaiting_name": {
      if (messageText.length >= 3) {
        const updatedConv = await storage.upsertConversation(from, { state: "awaiting_address", customerName: messageText });
        await sendTextMessage(from, 
          `Mulțumesc, ${messageText}! 😊\n\n` +
          "Acum te rog să-mi trimiți adresa de livrare completă:\n" +
          "(Strada, număr, bloc/scară/apartament, oraș, județ)"
        );
      } else {
        await sendTextMessage(from, "Te rog să scrii numele tău complet.");
      }
      break;
    }

    case "awaiting_address": {
      if (messageText.length >= 10) {
        const updatedConv = await storage.upsertConversation(from, { state: "awaiting_confirmation", deliveryAddress: messageText });
        
        const cart = updatedConv.cart || [];
        const customerName = updatedConv.customerName || "";
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        
        await sendTextMessage(from, 
          `📋 *REZUMAT COMANDĂ*\n\n` +
          `👤 Nume: ${customerName}\n` +
          `📱 Telefon: +${from}\n` +
          `📍 Adresă: ${messageText}\n\n` +
          `📦 Produse:\n` +
          cart.map(item => `• ${item.quantity}x ${item.name} - ${item.price * item.quantity} lei`).join('\n') +
          `\n\n🚚 Livrare: ${shipping === 0 ? "GRATUITĂ" : `${shipping} lei`}\n` +
          `💰 *TOTAL: ${total + shipping} lei*\n\n` +
          `💳 Plata: Ramburs la livrare\n\n` +
          `Scrie *DA* pentru a confirma comanda sau *NU* pentru a anula.`
        );
      } else {
        await sendTextMessage(from, "Te rog să scrii adresa completă de livrare.");
      }
      break;
    }

    case "awaiting_confirmation": {
      if (text === "da" || text === "confirm" || text === "ok") {
        const freshConv = await storage.getConversation(from);
        if (!freshConv) {
          await sendTextMessage(from, "A apărut o eroare. Te rog să începi din nou.");
          return;
        }
        
        const cart = freshConv.cart || [];
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        
        const addressParts = (freshConv.deliveryAddress || "").split(',').map(p => p.trim());
        const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : "Necunoscut";
        const county = addressParts.length > 0 ? addressParts[addressParts.length - 1] : "Necunoscut";
        
        try {
          const order = await storage.createOrder({
            customerName: freshConv.customerName || "Client WhatsApp",
            phoneNumber: `+${from}`,
            address: freshConv.deliveryAddress || "",
            city: city,
            county: county,
            products: cart,
            total: total,
            shippingCost: shipping,
            grandTotal: total + shipping
          });

          broadcastOrder(order);

          await sendTextMessage(from, 
            `🎉 *COMANDĂ CONFIRMATĂ!*\n\n` +
            `Număr comandă: #${order.id.slice(0, 8)}\n\n` +
            `Îți mulțumim că ai ales Luxe Parfum! ✨\n\n` +
            `Vei fi contactat în curând pentru confirmarea livrării.\n\n` +
            `Pentru orice întrebare, ne poți scrie aici.`
          );

          await notifyAdminNewOrder(order, from);
          
          // Send TikTok Events API - Purchase and PlaceAnOrder events (from WhatsApp)
          await sendTikTokPurchaseEvent(order, {
            ip: undefined, // No IP for WhatsApp orders
            userAgent: 'WhatsApp',
          });
          
          await storage.deleteConversation(from);
          
        } catch (error) {
          console.error("Error creating order from chatbot:", error);
          await sendTextMessage(from, "A apărut o eroare. Te rog să încerci din nou sau să ne contactezi direct.");
        }
      } else if (text === "nu" || text === "anuleaza" || text === "anulare") {
        await storage.deleteConversation(from);
        await sendTextMessage(from, 
          "Comanda a fost anulată.\n\n" +
          "Dacă vrei să cauți alt parfum, scrie-mi oricând! 🌸"
        );
      } else {
        await sendTextMessage(from, "Te rog să scrii *DA* pentru a confirma sau *NU* pentru a anula comanda.");
      }
      break;
    }

    default:
      await storage.upsertConversation(from, { state: "awaiting_search", searchResults: [] });
      await sendTextMessage(from, 
        "👋 Salut! Cu ce te pot ajuta?\n\n" +
        "Scrie numele parfumului căutat sau scrie 'dama', 'barbati' sau 'unisex' pentru a vedea opțiunile."
      );
  }
}

async function sendProductResults(to: string, products: Product[], header: string): Promise<void> {
  let message = `${header}\n\n`;
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.name}\n   💰 ${product.price} lei\n\n`;
  });
  message += "Scrie numărul parfumului dorit (ex: 1, 2, 3...)";
  await sendTextMessage(to, message);
}

async function notifyAdminMissingProduct(customerPhone: string, productQuery: string): Promise<void> {
  if (ADMIN_PHONE) {
    await sendTextMessage(ADMIN_PHONE, 
      `⚠️ PRODUS NEGĂSIT\n\n` +
      `Client: +${customerPhone}\n` +
      `Căutare: "${productQuery}"\n\n` +
      `Clientul caută un produs care nu este în catalog.`
    );
  } else {
    console.warn("ADMIN_PHONE_NUMBER not configured - missing product notification not sent for:", productQuery);
  }
}

async function notifyAdminNewOrder(order: Order, customerPhone: string): Promise<void> {
  if (ADMIN_PHONE) {
    const productList = order.products.map(p => `${p.quantity}x ${p.name}`).join(', ');
    await sendTextMessage(ADMIN_PHONE, 
      `🛒 COMANDĂ NOUĂ (WhatsApp)\n\n` +
      `#${order.id.slice(0, 8)}\n` +
      `👤 ${order.customerName}\n` +
      `📱 ${order.phoneNumber}\n` +
      `📍 ${order.address}\n` +
      `📦 ${productList}\n` +
      `💰 ${order.grandTotal} lei\n\n` +
      `Comandă plasată prin chatbot WhatsApp.`
    );
  } else {
    console.warn("ADMIN_PHONE_NUMBER not configured - order notification not sent for order:", order.id);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup WebSocket server for admin real-time updates
  adminWss = new WebSocketServer({ server: httpServer, path: "/ws/admin" });
  
  adminWss.on("connection", (ws, req) => {
    console.log("Admin WebSocket connected");
    adminClients.add(ws);
    
    // Send current visitors immediately
    const visitors = Array.from(activeVisitors.values());
    ws.send(JSON.stringify({ type: "visitors_update", visitors, count: visitors.length }));
    
    ws.on("close", () => {
      console.log("Admin WebSocket disconnected");
      adminClients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      adminClients.delete(ws);
    });
  });

  // Setup WebSocket server for visitor tracking
  visitorWss = new WebSocketServer({ server: httpServer, path: "/ws/visitor" });
  
  visitorWss.on("connection", (ws, req) => {
    const visitorId = Math.random().toString(36).substring(2, 10);
    const userAgent = req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    
    const visitor: Visitor = {
      id: visitorId,
      page: "/",
      lastAction: "A intrat pe site",
      lastActionTime: new Date(),
      connectedAt: new Date(),
      device: isMobile ? "Mobil" : "Desktop"
    };
    
    activeVisitors.set(ws, visitor);
    broadcastVisitors();
    
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        const visitor = activeVisitors.get(ws);
        if (visitor) {
          if (data.type === "page_view") {
            visitor.page = data.page;
            visitor.lastAction = `Vizitează: ${data.pageName || data.page}`;
            visitor.lastActionTime = new Date();
          } else if (data.type === "action") {
            visitor.lastAction = data.action;
            visitor.lastActionTime = new Date();
          }
          broadcastVisitors();
        }
      } catch (e) {
        console.error("Visitor message error:", e);
      }
    });
    
    ws.on("close", () => {
      activeVisitors.delete(ws);
      broadcastVisitors();
    });

    ws.on("error", () => {
      activeVisitors.delete(ws);
      broadcastVisitors();
    });
  });

  // Get all orders (for admin)
  app.get("/api/orders", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Broadcast status update to admin clients
      const message = JSON.stringify({ type: "order_updated", order });
      adminClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });

      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      console.log("=== ORDER REQUEST RECEIVED ===");
      console.log("Received order request body:", JSON.stringify(req.body, null, 2));
      console.log("Body type check - total:", typeof req.body.total, "value:", req.body.total);
      console.log("Body type check - shippingCost:", typeof req.body.shippingCost, "value:", req.body.shippingCost);
      console.log("Body type check - grandTotal:", typeof req.body.grandTotal, "value:", req.body.grandTotal);
      console.log("Body type check - products:", Array.isArray(req.body.products), "length:", req.body.products?.length);
      
      const validation = insertOrderSchema.safeParse(req.body);
      
      if (!validation.success) {
        console.error("=== ORDER VALIDATION FAILED ===");
        console.error("Validation errors:", JSON.stringify(validation.error.errors, null, 2));
        console.error("Received body:", JSON.stringify(req.body, null, 2));
        console.error("Error details:", validation.error);
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ 
          error: validationError.message,
          details: validation.error.errors 
        });
      }

      console.log("=== ORDER VALIDATION SUCCESSFUL ===");
      console.log("Validated data:", JSON.stringify(validation.data, null, 2));
      console.log("Creating order in database...");
      
      const order = await storage.createOrder(validation.data);
      console.log("=== ORDER CREATED SUCCESSFULLY ===");
      console.log("Order ID:", order.id);

      // Broadcast new order to admin clients
      broadcastOrder(order);

      const productList = order.products
        .map(p => `${p.quantity}x ${p.name} (${p.price} lei)`)
        .join(", ");

      // Full address with city and county
      const fullAddress = `${order.address}, ${order.city}, ${order.county}`;

      // Support multiple admin phone numbers (comma-separated)
      const adminPhones = process.env.ADMIN_PHONE_NUMBER?.split(',').map(p => p.trim()).filter(Boolean) || [];
      for (const adminPhone of adminPhones) {
        await sendWhatsAppMessage(
          adminPhone,
          "comanda",
          [
            order.customerName,
            order.phoneNumber,
            fullAddress,
            productList
          ]
        );
      }

      await sendWhatsAppMessage(
        order.phoneNumber,
        "client",
        [
          order.customerName,
            productList,
          `${order.grandTotal} lei`,
          "Luxe Parfum"
        ]
      );

      // Send TikTok Events API - Purchase and PlaceAnOrder events
      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      
      await sendTikTokPurchaseEvent(order, {
        ip: Array.isArray(clientIp) ? clientIp[0] : clientIp,
        userAgent: userAgent,
      });

      // Send email notifications (non-blocking)
      const customerEmail = (req.body as any).email;
      Promise.all([
        sendCustomerConfirmationEmail(order, customerEmail),
        sendAdminNotificationEmail(order),
      ]).catch(error => {
        console.error('Error sending emails:', error);
        // Don't fail the request if emails fail
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Webhook GET request received:", { mode, token, challenge: challenge ? "present" : "missing" });

    if (mode === "subscribe" && token === "parfum") {
      console.log("Webhook verified successfully");
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Verification failed");
    }
  });

  app.get("/api/webhook-test", (req, res) => {
    res.json({ 
      status: "OK", 
      message: "Webhook endpoint is reachable",
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/webhook", async (req, res) => {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));
    
    try {
      const entry = req.body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (value?.statuses) {
        for (const status of value.statuses) {
          const messageId = status.id;
          const statusValue = status.status;
          
          console.log(`Message ${messageId} status: ${statusValue}`);
          
          if (statusValue === "delivered") {
            await storage.updateLeadMessageStatus(messageId, "delivered");
          } else if (statusValue === "read") {
            await storage.updateLeadMessageStatus(messageId, "read");
          }
        }
      }
      
      if (value?.messages) {
        for (const message of value.messages) {
          const from = message.from;
          
          if (message.type === "button" && message.button?.payload) {
            console.log(`Button clicked by ${from}: ${message.button.payload}`);
            
            const leads = await storage.getAllLeads();
            const lead = leads.find(l => l.phoneNumber === from || l.phoneNumber === `+${from}`);
            if (lead && lead.messageId) {
              await storage.updateLeadLinkClicked(lead.messageId);
            }
            
            await handleChatbotMessage(from, "", message.button.payload);
          } else if (message.type === "text" && message.text?.body) {
            console.log(`Text message from ${from}: ${message.text.body}`);
            await handleChatbotMessage(from, message.text.body);
          } else if (message.type === "interactive" && message.interactive?.button_reply?.id) {
            console.log(`Interactive button from ${from}: ${message.interactive.button_reply.id}`);
            await handleChatbotMessage(from, "", message.interactive.button_reply.id);
          }
        }
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
    
    res.sendStatus(200);
  });

  // Lead capture endpoints
  app.post("/api/leads", async (req, res) => {
    try {
      const validation = insertLeadSchema.safeParse(req.body);
      
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ error: validationError.message });
      }

      const lead = await storage.createLead(validation.data);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.post("/api/leads/:id/send-message", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const leads = await storage.getAllLeads();
      const lead = leads.find(l => l.id === req.params.id);
      
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const result = await sendBazaTemplate(lead.phoneNumber);
      
      if (result.success && result.messageId) {
        await storage.updateLeadMessage(lead.id, result.messageId);
        const updatedLead = await storage.getAllLeads().then(leads => leads.find(l => l.id === lead.id));
        res.json({ success: true, lead: updatedLead });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error("Error sending message to lead:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/leads/send-all", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const leads = await storage.getAllLeads();
      const unsentLeads = leads.filter(l => !l.messageSentAt);
      
      let sent = 0;
      let failed = 0;

      for (const lead of unsentLeads) {
        const result = await sendBazaTemplate(lead.phoneNumber);
        if (result.success && result.messageId) {
          await storage.updateLeadMessage(lead.id, result.messageId);
          sent++;
        } else {
          failed++;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      res.json({ success: true, sent, failed, total: unsentLeads.length });
    } catch (error) {
      console.error("Error sending messages to all leads:", error);
      res.status(500).json({ error: "Failed to send messages" });
    }
  });

  return httpServer;
}
