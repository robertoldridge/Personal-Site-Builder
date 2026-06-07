import { pgTable, serial, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  description: text("description").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({ id: true, createdAt: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;
