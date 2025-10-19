import { Request, Response, NextFunction } from "express";

// Basic Auth credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Task Manager API"');
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      next();
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="Task Manager API"');
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Task Manager API"');
    return res.status(401).json({ error: "Invalid authorization header" });
  }
}
