import type { Express } from "express";
import { createServer, type Server } from "http";
import { basicAuth } from "./middleware/auth.js";
import { taskController } from "./controllers/taskController.js";
import { logController } from "./controllers/logController.js";

export function registerRoutes(app: Express): Server {
  // Apply Basic Auth middleware to all API routes
  app.use("/api", basicAuth);

  // Task routes
  app.get("/api/tasks", taskController.getTasks);
  app.get("/api/tasks/:id", taskController.getTask);
  app.post("/api/tasks", taskController.createTask);
  app.put("/api/tasks/:id", taskController.updateTask);
  app.delete("/api/tasks/:id", taskController.deleteTask);

  // Audit log routes
  app.get("/api/logs", logController.getLogs);

  const httpServer = createServer(app);

  return httpServer;
}

