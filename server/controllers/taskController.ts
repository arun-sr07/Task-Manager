import { Request, Response } from "express";
import { storage } from "../storage";
import { insertTaskSchema } from "@shared/schema";
import { sanitizeInput, containsDangerousPatterns } from "../utils/sanitize";

export const taskController = {
  // GET /api/tasks - Get all tasks
  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  },

  // GET /api/tasks/:id - Get a single task
  async getTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve task" });
    }
  },

  // POST /api/tasks - Create a new task
  async createTask(req: Request, res: Response) {
    try {
      // Validate input
      const validation = insertTaskSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.error.errors,
        });
      }

      // Additional sanitization check
      if (
        containsDangerousPatterns(validation.data.title) ||
        containsDangerousPatterns(validation.data.description)
      ) {
        return res.status(400).json({
          error: "Input contains invalid characters or patterns",
        });
      }

      // Sanitize the data
      const sanitizedData = {
        title: sanitizeInput(validation.data.title),
        description: sanitizeInput(validation.data.description),
      };

      // Create task
      const task = await storage.createTask(sanitizedData);

      // Create audit log
      await storage.createLog({
        timestamp: new Date().toISOString(),
        action: "Create",
        taskId: task.id,
        updatedContent: `title: "${task.title}", description: "${task.description}"`,
        notes: null,
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  },

  // PUT /api/tasks/:id - Update a task
  async updateTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      // Validate input
      const validation = insertTaskSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.error.errors,
        });
      }

      // Additional sanitization check
      if (
        containsDangerousPatterns(validation.data.title) ||
        containsDangerousPatterns(validation.data.description)
      ) {
        return res.status(400).json({
          error: "Input contains invalid characters or patterns",
        });
      }

      // Sanitize the data
      const sanitizedData = {
        title: sanitizeInput(validation.data.title),
        description: sanitizeInput(validation.data.description),
      };

      // Get existing task to track changes
      const existingTask = await storage.getTask(id);
      if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Update task
      const updatedTask = await storage.updateTask(id, sanitizedData);
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Track what changed
      const changes: string[] = [];
      if (existingTask.title !== updatedTask.title) {
        changes.push(`title: "${updatedTask.title}"`);
      }
      if (existingTask.description !== updatedTask.description) {
        changes.push(`description: "${updatedTask.description}"`);
      }

      // Create audit log
      await storage.createLog({
        timestamp: new Date().toISOString(),
        action: "Update",
        taskId: id,
        updatedContent: changes.length > 0 ? changes.join(", ") : null,
        notes: null,
      });

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  },

  // DELETE /api/tasks/:id - Delete a task
  async deleteTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Create audit log
      await storage.createLog({
        timestamp: new Date().toISOString(),
        action: "Delete",
        taskId: id,
        updatedContent: null,
        notes: null,
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  },
};
