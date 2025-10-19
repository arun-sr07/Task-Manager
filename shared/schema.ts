import { z } from "zod";

// Task schema for in-memory storage
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

// Insert schema with validation rules
export const insertTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .refine(
      (val) => !/<script|<\/script|javascript:|on\w+=/i.test(val),
      "Title cannot contain HTML or script tags"
    ),
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .refine(
      (val) => !/<script|<\/script|javascript:|on\w+=/i.test(val),
      "Description cannot contain HTML or script tags"
    ),
});

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Audit Log schema
export const auditLogSchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  action: z.enum(["Create", "Update", "Delete"]),
  taskId: z.number(),
  updatedContent: z.string().nullable(),
  notes: z.string().nullable(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;
