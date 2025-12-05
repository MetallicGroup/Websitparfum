import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { orders, leads, type Order, type InsertOrder, type Lead, type InsertLead } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

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
}

export class DatabaseStorage implements IStorage {
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
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
}

export const storage = new DatabaseStorage();
