import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle Table Definitions
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: text("action").notNull(), // "Create", "Update", "Delete"
  taskId: integer("task_id").notNull(),
  updatedContent: text("updated_content"),
  notes: text("notes"),
});

// Zod Schemas based on Drizzle tables
export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1, "Title is required").max(100, "Title must be 100 characters or less").refine(
    (val) => !/<script|<\/script|javascript:|on\w+=/i.test(val),
    "Title cannot contain HTML or script tags"
  ),
  description: (schema) => schema.max(500, "Description must be 500 characters or less").refine(
    (val) => !/<script|<\/script|javascript:|on\w+=/i.test(val),
    "Description cannot contain HTML or script tags"
  ),
}).omit({ id: true, createdAt: true });

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });

// Types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

