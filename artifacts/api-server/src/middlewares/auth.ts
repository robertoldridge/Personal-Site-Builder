import { type Request, type Response, type NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] as string | undefined;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }
  if (!token || token !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
