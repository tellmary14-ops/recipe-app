import { db, pool } from "../config/db.js";
import { recipesTable } from "../db/schema.js";

const seedRecipes = async () => {
  try {
    // ensure the recipes table exists (create if missing)
    const createSql = `CREATE TABLE IF NOT EXISTS \`recipes\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT,
      \`image\` TEXT,
      \`cook_time\` VARCHAR(100),
      \`servings\` VARCHAR(100),
      \`category\` VARCHAR(100),
      \`area\` VARCHAR(100),
      \`ingredients\` TEXT,
      \`instructions\` TEXT,
      \`youtube_url\` VARCHAR(255),
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    await pool.query(createSql);

    // simple seed — will insert if table is empty
    const existing = await db.select().from(recipesTable).limit(1);
    if (existing && existing.length > 0) {
      console.log("Recipes table already has data — skipping seed.");
      return;
    }

    const recipes = [
      {
        title: "Jollof Rice",
        description: "Spicy, tomato-based rice cooked with peppers and seasonings — West African favorite.",
        image: "https://example.com/jollof.jpg",
        cookTime: "45 minutes",
        servings: "4",
        category: "Main Course",
        area: "Nigerian",
        ingredients: JSON.stringify([
          "2 cups long grain parboiled rice",
          "3 large tomatoes (blended)",
          "1 red bell pepper",
          "1/4 cup vegetable oil",
          "1 onion",
          "2 tsp curry powder",
          "2 stock cubes",
        ]),
        instructions: JSON.stringify([
          "Blend tomatoes, pepper and onion into a smooth paste.",
          "Heat oil, fry chopped onions then add blended pepper mix and cook until reduced.",
          "Add spices, stock cubes and parboiled rice; add water to cover and simmer until rice is cooked.",
        ]),
        youtubeUrl: null,
      },
      {
        title: "Egusi Soup",
        description: "Rich melon seed soup cooked with leafy greens and assorted meats.",
        image: "https://example.com/egusi.jpg",
        cookTime: "60 minutes",
        servings: "4",
        category: "Soup",
        area: "Nigerian",
        ingredients: JSON.stringify([
          "2 cups egusi (melon) seeds, ground",
          "Assorted meat (beef, tripe)",
          "Palm oil",
          "Leafy greens (ugu or spinach)",
          "Seasoning",
        ]),
        instructions: JSON.stringify([
          "Cook meats until tender and set aside with stock.",
          "Fry ground egusi in palm oil to form a paste, add stock and cook.",
          "Add meat, greens and simmer for 10 minutes.",
        ]),
        youtubeUrl: null,
      },
      {
        title: "Suya",
        description: "Spicy grilled skewered beef seasoned with peanut and chili rub.",
        image: "https://example.com/suya.jpg",
        cookTime: "30 minutes",
        servings: "4",
        category: "Snack",
        area: "Nigerian",
        ingredients: JSON.stringify([
          "500g beef, thinly sliced",
          "Suya spice (ground peanuts, chili, ginger)",
          "Salt",
          "Skewers",
        ]),
        instructions: JSON.stringify([
          "Coat beef slices with suya spice and salt.",
          "Thread onto skewers and grill until cooked through.",
        ]),
        youtubeUrl: null,
      },
      {
        title: "Moi Moi",
        description: "Steamed bean pudding made from blended black-eyed peas.",
        image: "https://example.com/moimoi.jpg",
        cookTime: "60 minutes",
        servings: "6",
        category: "Side",
        area: "Nigerian",
        ingredients: JSON.stringify([
          "2 cups peeled black-eyed peas",
          "1 onion",
          "1 red pepper",
          "Seasoning",
          "Vegetable oil",
        ]),
        instructions: JSON.stringify([
          "Blend beans with pepper and onion to a smooth paste.",
          "Mix in oil and seasoning, pour into containers and steam until set.",
        ]),
        youtubeUrl: null,
      },
      {
        title: "Peppered Fish",
        description: "Fried fish tossed in a hot pepper and tomato sauce.",
        image: "https://example.com/pepperedfish.jpg",
        cookTime: "35 minutes",
        servings: "3",
        category: "Main Course",
        area: "Nigerian",
        ingredients: JSON.stringify([
          "Whole fish or fillets",
          "Tomatoes, peppers, onions blended",
          "Seasoning",
          "Vegetable oil",
        ]),
        instructions: JSON.stringify([
          "Fry the fish until golden and set aside.",
          "Prepare pepper-tomato sauce and simmer, then add fish to coat.",
        ]),
        youtubeUrl: null,
      },
    ];

    for (const r of recipes) {
      await db.insert(recipesTable).values(r);
    }

    console.log("Seed complete — inserted recipes.");
  } catch (err) {
    console.error("Error seeding recipes:", err);
  } finally {
    process.exit(0);
  }
};

seedRecipes();
