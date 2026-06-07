import { pgTable, serial, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  companyUrl: text("company_url").notNull().default(""),
  role: text("role").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  description: text("description").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true, createdAt: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;
