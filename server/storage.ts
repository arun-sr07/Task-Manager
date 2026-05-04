import { type Task, type InsertTask, type AuditLog, type InsertAuditLog, tasks, auditLogs } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface with all CRUD operations
export interface IStorage {
  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: InsertTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Audit log operations
  getLogs(): Promise<AuditLog[]>;
  createLog(log: InsertAuditLog): Promise<AuditLog>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.id));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, insertTask: InsertTask): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(insertTask)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return !!deletedTask;
  }

  async getLogs(): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.id));
  }

  async createLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private logs: Map<number, AuditLog>;
  private taskIdCounter: number;
  private logIdCounter: number;

  constructor() {
    this.tasks = new Map();
    this.logs = new Map();
    this.taskIdCounter = 1;
    this.logIdCounter = 1;
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => b.id - a.id);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, insertTask: InsertTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existingTask,
      title: insertTask.title,
      description: insertTask.description,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Audit log operations
  async getLogs(): Promise<AuditLog[]> {
    return Array.from(this.logs.values()).sort((a, b) => b.id - a.id);
  }

  async createLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = this.logIdCounter++;
    const auditLog: AuditLog = {
      id,
      timestamp: new Date(),
      ...log,
    };
    this.logs.set(id, auditLog);
    return auditLog;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

