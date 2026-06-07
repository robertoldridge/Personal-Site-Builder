import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profileTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/profile", async (req, res) => {
  const rows = await db.select().from(profileTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(profileTable).values({}).returning();
    res.json(inserted[0]);
    return;
  }
  res.json(rows[0]);
});

router.put("/profile", requireAdmin, async (req, res) => {
  const rows = await db.select().from(profileTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(profileTable).values(req.body).returning();
    res.json(inserted[0]);
    return;
  }
  const updated = await db
    .update(profileTable)
    .set(req.body)
    .where(eq(profileTable.id, rows[0].id))
    .returning();
  res.json(updated[0]);
});

export default router;
