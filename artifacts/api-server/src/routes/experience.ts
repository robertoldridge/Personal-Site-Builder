import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { experienceTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/experience", async (_req, res) => {
  const rows = await db
    .select()
    .from(experienceTable)
    .orderBy(experienceTable.displayOrder);
  res.json(rows);
});

router.post("/experience", requireAdmin, async (req, res) => {
  const inserted = await db.insert(experienceTable).values(req.body).returning();
  res.status(201).json(inserted[0]);
});

router.put("/experience/:id", requireAdmin, async (req, res) => {
  const updated = await db
    .update(experienceTable)
    .set(req.body)
    .where(eq(experienceTable.id, Number(req.params.id)))
    .returning();
  res.json(updated[0]);
});

router.delete("/experience/:id", requireAdmin, async (req, res) => {
  await db
    .delete(experienceTable)
    .where(eq(experienceTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
