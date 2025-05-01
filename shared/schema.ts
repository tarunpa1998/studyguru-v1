import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("isAdmin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Scholarship model
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
  deadline: text("deadline").notNull(),
  country: text("country").notNull(),
  tags: text("tags").array().notNull(),
  slug: text("slug").notNull().unique(),
  link: text("link"),
});

export const insertScholarshipSchema = createInsertSchema(scholarships).omit({
  id: true,
});

export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Scholarship = typeof scholarships.$inferSelect;

// Article model
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  slug: text("slug").notNull().unique(),
  publishDate: text("publish_date").notNull(),
  author: text("author").notNull(),
  authorTitle: text("author_title"),
  authorImage: text("author_image"),
  image: text("image"),
  category: text("category").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Country model
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  universities: integer("universities").notNull(),
  acceptanceRate: text("acceptance_rate").notNull(),
  image: text("image"),
  slug: text("slug").notNull().unique(),
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

// University model
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  country: text("country").notNull(),
  ranking: integer("ranking"),
  image: text("image"),
  slug: text("slug").notNull().unique(),
  features: text("features").array(),
});

export const insertUniversitySchema = createInsertSchema(universities).omit({
  id: true,
});

export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type University = typeof universities.$inferSelect;

// News model
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  publishDate: text("publish_date").notNull(),
  image: text("image"),
  category: text("category").notNull(),
  isFeatured: boolean("is_featured").default(false),
  slug: text("slug").notNull().unique(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Menu model
export const menu = pgTable("menu", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  children: jsonb("children"),
});

export const insertMenuSchema = createInsertSchema(menu).omit({
  id: true,
});

export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Menu = typeof menu.$inferSelect;
