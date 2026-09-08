import { mysqlTable, int, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const favoritesTable = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  recipeId: int("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipesTable = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  cookTime: varchar("cook_time", { length: 100 }),
  servings: varchar("servings", { length: 100 }),
  category: varchar("category", { length: 100 }),
  area: varchar("area", { length: 100 }),
  ingredients: text("ingredients"),
  instructions: text("instructions"),
  youtubeUrl: varchar("youtube_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
