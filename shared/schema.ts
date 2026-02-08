import { pgTable, text, real, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  messageId: text("message_id"),
  messageSentAt: timestamp("message_sent_at"),
  messageStatus: text("message_status").default("pending"),
  linkClicked: timestamp("link_clicked"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  county: text("county").notNull(),
  postalCode: text("postal_code"),
  products: jsonb("products").notNull().$type<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>>(),
  total: real("total").notNull(),
  shippingCost: real("shipping_cost").notNull(),
  grandTotal: real("grand_total").notNull(),
  status: text("status").notNull().default("pending"),
  trafficSource: text("traffic_source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create explicit schema to ensure correct types
export const insertOrderSchema = z.object({
  customerName: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  county: z.string().min(1),
  postalCode: z.string().optional(),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
  })).min(1),
  total: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  grandTotal: z.number().nonnegative(),
  trafficSource: z.string().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const conversationStates = pgTable("conversation_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  customerName: text("customer_name"),
  state: text("state").notNull().default("idle"),
  cart: jsonb("cart").$type<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>>().default([]),
  searchResults: jsonb("search_results").$type<Array<{
    id: string;
    name: string;
    price: number;
  }>>().default([]),
  deliveryAddress: text("delivery_address"),
  lastMessage: text("last_message"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ConversationState = typeof conversationStates.$inferSelect;

export const insertLeadSchema = createInsertSchema(leads);

// Visitor sessions table
export const visitorSessions = pgTable("visitor_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  userAgent: text("user_agent"),
  device: text("device"),
  firstVisit: timestamp("first_visit").notNull().defaultNow(),
  lastVisit: timestamp("last_visit").notNull().defaultNow(),
  pageViews: real("page_views").notNull().default(1),
  addedToCart: real("added_to_cart").notNull().default(0),
  trafficSource: text("traffic_source"),
});

// Visitor events table
export const visitorEvents = pgTable("visitor_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(), // 'page_view', 'add_to_cart', etc.
  eventData: jsonb("event_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
