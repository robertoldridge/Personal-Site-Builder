import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/projects", async (_req, res) => {
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(projectsTable.displayOrder);
  res.json(rows);
});

router.post("/projects", requireAdmin, async (req, res) => {
  const inserted = await db.insert(projectsTable).values(req.body).returning();
  res.status(201).json(inserted[0]);
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  const updated = await db
    .update(projectsTable)
    .set(req.body)
    .where(eq(projectsTable.id, Number(req.params.id)))
    .returning();
  res.json(updated[0]);
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
