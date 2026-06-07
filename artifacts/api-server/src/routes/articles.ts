import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { articlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/articles", async (req, res) => {
  const includeUnpublished = req.query.includeUnpublished === "true";
  const rows = await db
    .select()
    .from(articlesTable)
    .orderBy(articlesTable.publishedDate);
  const filtered = includeUnpublished ? rows : rows.filter((r) => r.published);
  res.json(filtered.reverse());
});

router.post("/articles", requireAdmin, async (req, res) => {
  const inserted = await db.insert(articlesTable).values(req.body).returning();
  res.status(201).json(inserted[0]);
});

router.get("/articles/:slug", async (req, res) => {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, req.params.slug))
    .limit(1);
  if (rows.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(rows[0]);
});

router.put("/articles/:slug", requireAdmin, async (req, res) => {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, req.params.slug))
    .limit(1);
  if (rows.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await db
    .update(articlesTable)
    .set(req.body)
    .where(eq(articlesTable.slug, req.params.slug))
    .returning();
  res.json(updated[0]);
});

router.delete("/articles/:slug", requireAdmin, async (req, res) => {
  await db
    .delete(articlesTable)
    .where(eq(articlesTable.slug, req.params.slug));
  res.status(204).send();
});

export default router;
