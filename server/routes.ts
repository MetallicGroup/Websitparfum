import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema, type Order } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const ADMIN_PASSWORD = "luxeparfum2024";

let wss: WebSocketServer;
const adminClients: Set<WebSocket> = new Set();

function broadcastOrder(order: Order) {
  const message = JSON.stringify({ type: "new_order", order });
  adminClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup WebSocket server for admin real-time updates
  wss = new WebSocketServer({ server: httpServer, path: "/ws/admin" });
  
  wss.on("connection", (ws, req) => {
    console.log("Admin WebSocket connected");
    adminClients.add(ws);
    
    ws.on("close", () => {
      console.log("Admin WebSocket disconnected");
      adminClients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      adminClients.delete(ws);
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
      const validation = insertOrderSchema.safeParse(req.body);
      
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ error: validationError.message });
      }

      const order = await storage.createOrder(validation.data);

      // Broadcast new order to admin clients
      broadcastOrder(order);

      const productList = order.products
        .map(p => `${p.quantity}x ${p.name} (${p.price} lei)`)
        .join(", ");

      const adminPhone = process.env.ADMIN_PHONE_NUMBER;
      if (adminPhone) {
        await sendWhatsAppMessage(
          adminPhone,
          "comanda",
          [
            order.customerName,
            order.phoneNumber,
            order.address,
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

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === "parfum") {
      console.log("Webhook verified successfully");
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Verification failed");
    }
  });

  app.post("/api/webhook", (req, res) => {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  });

  return httpServer;
}
