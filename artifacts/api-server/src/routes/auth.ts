import { Router, type IRouter } from "express";
import { generateSecret, verifySync, generateURI } from "otplib";
import QRCode from "qrcode";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ipAllowlist } from "../middlewares/auth";

const router: IRouter = Router();

router.use(["/auth/verify", "/auth/totp-status", "/auth/setup-totp", "/auth/confirm-totp", "/auth/reset-totp"], ipAllowlist);

async function getSetting(key: string): Promise<string | null> {
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value, updatedAt: new Date() } });
}

router.get("/auth/totp-status", async (_req, res) => {
  const secret = await getSetting("totp_secret");
  const confirmed = await getSetting("totp_confirmed");
  res.json({ configured: !!secret && confirmed === "true" });
});

router.post("/auth/setup-totp", async (req, res) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  let secret = await getSetting("totp_secret");
  const confirmed = await getSetting("totp_confirmed");

  if (!secret) {
    secret = generateSecret();
    await setSetting("totp_secret", secret);
    await setSetting("totp_confirmed", "false");
  }

  const otpAuthUrl = generateURI({ issuer: "CV Admin", label: "admin", secret });
  const qrDataUrl = await QRCode.toDataURL(otpAuthUrl);

  res.json({
    qrDataUrl,
    secret,
    alreadyConfirmed: confirmed === "true",
  });
});

router.post("/auth/confirm-totp", async (req, res) => {
  const { password, totpCode } = req.body as { password: string; totpCode: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const secret = await getSetting("totp_secret");
  if (!secret) {
    res.status(400).json({ error: "TOTP not set up yet" });
    return;
  }

  const result = verifySync({ token: totpCode, secret });
  if (!result.valid) {
    res.status(400).json({ error: "Invalid code" });
    return;
  }

  await setSetting("totp_confirmed", "true");
  res.json({ ok: true });
});

router.post("/auth/verify", async (req, res) => {
  const { password, totpCode } = req.body as { password: string; totpCode?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }

  if (password !== adminPassword) {
    res.json({ ok: false, reason: "invalid_password" });
    return;
  }

  const secret = await getSetting("totp_secret");
  const confirmed = await getSetting("totp_confirmed");
  const totpEnabled = !!secret && confirmed === "true";

  if (totpEnabled) {
    if (!totpCode) {
      res.json({ ok: false, reason: "totp_required" });
      return;
    }
    const result = verifySync({ token: totpCode, secret });
    if (!result.valid) {
      res.json({ ok: false, reason: "invalid_totp" });
      return;
    }
  }

  res.json({ ok: true, totpEnabled });
});

router.post("/auth/reset-totp", async (req, res) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await db.delete(settingsTable).where(eq(settingsTable.key, "totp_secret"));
  await db.delete(settingsTable).where(eq(settingsTable.key, "totp_confirmed"));
  res.json({ ok: true });
});

export default router;
