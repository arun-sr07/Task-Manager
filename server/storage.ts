import { type Task, type InsertTask, type AuditLog } from "@shared/schema";

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
  createLog(log: Omit<AuditLog, "id">): Promise<AuditLog>;
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
      createdAt: new Date().toISOString(),
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

  async createLog(log: Omit<AuditLog, "id">): Promise<AuditLog> {
    const id = this.logIdCounter++;
    const auditLog: AuditLog = {
      id,
      ...log,
    };
    this.logs.set(id, auditLog);
    return auditLog;
  }
}

export const storage = new MemStorage();
