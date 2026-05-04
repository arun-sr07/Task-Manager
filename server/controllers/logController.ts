import { Request, Response } from "express";
import { storage } from "../storage";

export const logController = {
  // GET /api/logs - Get all audit logs
  async getLogs(req: Request, res: Response) {
    try {
      const logs = await storage.getLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error in getLogs:", error);
      res.status(500).json({ error: "Failed to retrieve audit logs" });
    }
  },
};
