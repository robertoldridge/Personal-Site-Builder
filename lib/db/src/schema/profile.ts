import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Your Name"),
  title: text("title").notNull().default("Developer / Researcher / Thinker"),
  bio: text("bio").notNull().default("Welcome to my homepage."),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;
