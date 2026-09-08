import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable, recipesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Recipes endpoints
app.get("/api/recipes", async (req, res) => {
  try {
    const all = await db.select().from(recipesTable).orderBy(recipesTable.id);
    res.status(200).json(all);
  } catch (error) {
    console.error("Error fetching recipes", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/recipes/featured", async (req, res) => {
  try {
    // return a random recipe from the table as featured
    const all = await db.select().from(recipesTable);
    if (!all || all.length === 0) return res.status(200).json(null);
    const random = all[Math.floor(Math.random() * all.length)];
    res.status(200).json(random);
  } catch (error) {
    console.error("Error fetching featured recipe", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Generate or return recipes for a given African area (falls back to TheMealDB)
app.get("/api/recipes/generate", async (req, res) => {
  try {
    const area = req.query.area || "Nigerian";
    const count = parseInt(req.query.count) || 5;

    // try to get existing recipes from DB
    const existing = await db.select().from(recipesTable).where(eq(recipesTable.area, area));

    if (existing && existing.length >= count) {
      // return random selection
      const shuffled = existing.sort(() => 0.5 - Math.random()).slice(0, count);
      return res.status(200).json(shuffled);
    }

    // Fetch from TheMealDB to fill missing recipes
    const fetch = global.fetch;
    const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

    const filterResp = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    if (!filterResp.ok) return res.status(502).json({ error: "Failed to fetch external meals" });
    const filterData = await filterResp.json();
    const list = filterData.meals || [];
    if (list.length === 0 && existing.length === 0) return res.status(200).json([]);

    // determine which ids we still need
    const needed = count - (existing ? existing.length : 0);
    const toUse = list.slice(0, needed);

    // fetch details for each id, up to needed
    const details = [];
    for (const item of toUse) {
      try {
        const lookup = await fetch(`${BASE_URL}/lookup.php?i=${item.idMeal}`);
        if (!lookup.ok) continue;
        const data = await lookup.json();
        const meal = data.meals ? data.meals[0] : null;
        if (!meal) continue;

        // map into our recipes table shape
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ing && ing.trim()) {
            ingredients.push(((measure || "") + " ").trim() + " " + ing.trim());
          }
        }

        const instructions = meal.strInstructions ? meal.strInstructions.split(/\r?\n/).filter(Boolean) : [];

        const row = {
          title: meal.strMeal,
          description: meal.strInstructions ? meal.strInstructions.substring(0, 240) : null,
          image: meal.strMealThumb || null,
          cookTime: "",
          servings: "",
          category: meal.strCategory || null,
          area: meal.strArea || area,
          ingredients: JSON.stringify(ingredients),
          instructions: JSON.stringify(instructions),
          youtube_url: meal.strYoutube || null,
        };

        // insert into DB if not existing (by title+area)
        try {
          await db.insert(recipesTable).values(row);
        } catch (e) {
          console.warn("Insert recipe warning:", e.message || e);
        }

        details.push(row);
      } catch (err) {
        console.warn("Error fetching meal detail", err);
      }
    }

    // re-query DB for the area and return up to count
    const allNow = await db.select().from(recipesTable).where(eq(recipesTable.area, area));
    const result = allNow.sort(() => 0.5 - Math.random()).slice(0, count);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating recipes", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
