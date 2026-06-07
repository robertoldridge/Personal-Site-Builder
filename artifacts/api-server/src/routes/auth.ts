import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/auth/verify", (req, res) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }
  res.json({ ok: password === adminPassword });
});

export default router;
