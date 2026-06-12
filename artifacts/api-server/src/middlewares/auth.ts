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

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return first.trim();
  }
  return req.socket?.remoteAddress ?? req.ip ?? "";
}

export function ipAllowlist(req: Request, res: Response, next: NextFunction) {
  const allowedIps = process.env.ADMIN_ALLOWED_IPS;
  if (!allowedIps || allowedIps.trim() === "") {
    next();
    return;
  }
  const allowed = allowedIps.split(",").map((ip) => ip.trim()).filter(Boolean);
  const clientIp = getClientIp(req);
  if (allowed.some((ip) => clientIp === ip || clientIp.endsWith(`:${ip}`) || clientIp === `::ffff:${ip}`)) {
    next();
    return;
  }
  res.status(403).json({ error: "Access denied: your IP is not on the allowlist" });
}
