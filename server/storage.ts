import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { orders, leads, conversationStates, type Order, type InsertOrder, type Lead, type InsertLead, type ConversationState } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("=== DATABASE CONNECTION ERROR ===");
  console.error("DATABASE_URL environment variable is not set!");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB')));
  throw new Error("DATABASE_URL environment variable is required but not set");
}

console.log("=== DATABASE CONNECTION INIT ===");
console.log("DATABASE_URL is set:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0);
console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20) || "N/A");

// Initialize pool with explicit connection string
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required but not provided");
}

const pool = new Pool({ connectionString });
const db = drizzle(pool);

// Create tables if they don't exist
async function ensureTablesExist() {
  try {
    console.log("=== ENSURING TABLES EXIST ===");
    
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        county TEXT NOT NULL,
        postal_code TEXT,
        products JSONB NOT NULL,
        total REAL NOT NULL,
        shipping_cost REAL NOT NULL,
        grand_total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        traffic_source TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        message_id TEXT,
        message_sent_at TIMESTAMP,
        message_status TEXT DEFAULT 'pending',
        link_clicked TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create conversation_states table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversation_states (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number TEXT NOT NULL UNIQUE,
        customer_name TEXT,
        state TEXT NOT NULL DEFAULT 'idle',
        cart JSONB DEFAULT '[]',
        search_results JSONB DEFAULT '[]',
        delivery_address TEXT,
        last_message TEXT,
        last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log("All tables created/verified successfully");
  } catch (error: any) {
    // If tables already exist, that's fine
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log("Tables already exist, continuing...");
    } else {
      console.error("Error creating tables:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      // Don't throw - allow app to start even if table creation fails
      // They might already exist
    }
  }
}

// Ensure tables exist on startup (only in production)
if (process.env.NODE_ENV === "production") {
  ensureTablesExist().catch(err => {
    console.error("Failed to ensure tables exist:", err);
  });
}

console.log("Database pool and drizzle instance created successfully");

export interface IStorage {
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  updateLeadMessage(id: string, messageId: string): Promise<Lead | undefined>;
  updateLeadMessageStatus(messageId: string, status: string): Promise<Lead | undefined>;
  updateLeadLinkClicked(messageId: string): Promise<Lead | undefined>;
  getLeadByPhone(phoneNumber: string): Promise<Lead | undefined>;
  getConversation(phoneNumber: string): Promise<ConversationState | undefined>;
  upsertConversation(phoneNumber: string, data: Partial<Omit<ConversationState, 'id' | 'createdAt'>>): Promise<ConversationState>;
  deleteConversation(phoneNumber: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Verify connection string is still available at runtime
    if (!process.env.DATABASE_URL) {
      console.error("=== RUNTIME DATABASE ERROR ===");
      console.error("DATABASE_URL is missing at runtime!");
      throw new Error("Database connection string is not available");
    }
    
    try {
      const [order] = await db.insert(orders).values(insertOrder).returning();
      return order;
    } catch (error) {
      console.error("=== DATABASE INSERT ERROR ===");
      console.error("Error inserting order:", error);
      console.error("DATABASE_URL available:", !!process.env.DATABASE_URL);
      throw error;
    }
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async updateLeadMessage(id: string, messageId: string): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ messageId, messageSentAt: new Date(), messageStatus: "sent" })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async updateLeadMessageStatus(messageId: string, status: string): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ messageStatus: status })
      .where(eq(leads.messageId, messageId))
      .returning();
    return lead;
  }

  async updateLeadLinkClicked(messageId: string): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ linkClicked: new Date() })
      .where(eq(leads.messageId, messageId))
      .returning();
    return lead;
  }

  async getLeadByPhone(phoneNumber: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.phoneNumber, phoneNumber));
    return lead;
  }

  async getConversation(phoneNumber: string): Promise<ConversationState | undefined> {
    const [conversation] = await db.select().from(conversationStates).where(eq(conversationStates.phoneNumber, phoneNumber));
    return conversation;
  }

  async upsertConversation(phoneNumber: string, data: Partial<Omit<ConversationState, 'id' | 'createdAt'>>): Promise<ConversationState> {
    const existing = await this.getConversation(phoneNumber);
    if (existing) {
      const [updated] = await db
        .update(conversationStates)
        .set({ ...data, lastUpdated: new Date() })
        .where(eq(conversationStates.phoneNumber, phoneNumber))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(conversationStates)
        .values({ phoneNumber, ...data, lastUpdated: new Date() })
        .returning();
      return created;
    }
  }

  async deleteConversation(phoneNumber: string): Promise<void> {
    await db.delete(conversationStates).where(eq(conversationStates.phoneNumber, phoneNumber));
  }
}

export const storage = new DatabaseStorage();
