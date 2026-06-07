import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { educationTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/education", async (_req, res) => {
  const rows = await db
    .select()
    .from(educationTable)
    .orderBy(educationTable.displayOrder);
  res.json(rows);
});

router.post("/education", requireAdmin, async (req, res) => {
  const inserted = await db.insert(educationTable).values(req.body).returning();
  res.status(201).json(inserted[0]);
});

router.put("/education/:id", requireAdmin, async (req, res) => {
  const updated = await db
    .update(educationTable)
    .set(req.body)
    .where(eq(educationTable.id, Number(req.params.id)))
    .returning();
  res.json(updated[0]);
});

router.delete("/education/:id", requireAdmin, async (req, res) => {
  await db
    .delete(educationTable)
    .where(eq(educationTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
