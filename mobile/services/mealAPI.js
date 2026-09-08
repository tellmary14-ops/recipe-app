const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
// Change this to the area you want the app to focus on
const AREA = "British";
;

export const MealAPI = {
  // search meal by name
  searchMealsByName: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  // lookup full meal details by id
  getMealById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      if (!response.ok) {
        console.error(`Non-OK response fetching meal id ${id}:`, response.status);
        return null;
      }
      // read as text first so we can safely handle invalid JSON responses
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data.meals ? data.meals[0] : null;
      } catch (parseErr) {
        // log small snippet of the invalid body to help debugging
        console.error(`Invalid JSON for meal id ${id}:`, text.slice(0, 300));
        return null;
      }
    } catch (error) {
      console.error("Error getting meal by id:", error);
      return null;
    }
  },

  // get meals by area (returns lightweight meal objects with id, name, thumb)
getMealsByArea: async (area = AREA) => {
  try {
    // Nigerian area is broken in filter.php → fallback
    if (area === "Nigerian") {
      const response = await fetch(`${BASE_URL}/search.php?s=`);
      const data = await response.json();
      return (data.meals || []).filter(
        (meal) => meal.strArea === "Nigerian"
      );
    }

   
    const response = await fetch(
      `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`
    );
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error getting meals by area:", error);
    return [];
  }
},
  

  // helper: fetch detailed meal objects for an array of ids in batched concurrency
  fetchMealDetails: async (ids = [], concurrency = 5) => {
    const results = [];
    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency);
      const promises = batch.map((m) => MealAPI.getMealById(m));
      const res = await Promise.all(promises);
      for (const r of res) if (r) results.push(r);
    }
    return results;
  },

  // lookup a single random meal constrained to AREA
  getRandomMeal: async () => {
    try {
      const list = await MealAPI.getMealsByArea();
      if (!list || list.length === 0) return null;
      const random = list[Math.floor(Math.random() * list.length)];
      const details = await MealAPI.fetchMealDetails([random.idMeal]);
      return details.length ? details[0] : null;
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  // get multiple meals (random selection) constrained to AREA
  getRandomMeals: async (count = 6) => {
    try {
      const list = await MealAPI.getMealsByArea();
      if (!list || list.length === 0) return [];
      const shuffled = list.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map((m) => m.idMeal);
      const details = await MealAPI.fetchMealDetails(selected);
      return details;
    } catch (error) {
      console.error("Error getting random meals:", error);
      return [];
    }
  },

  // list all meal categories
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  // filter by main ingredient (still returns results across areas)
  // NOTE: TheMealDB's ingredient filter doesn't include area. We fetch details and keep only AREA meals.
  filterByIngredient: async (ingredient) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      if (!response.ok) return [];
      const data = await response.json();
      const list = data.meals || [];
      if (list.length === 0) return [];
      // intersect ids with area list to avoid fetching unnecessary details
      const areaList = await MealAPI.getMealsByArea();
      const areaIds = new Set(areaList.map((m) => m.idMeal));
      const candidateIds = list.map((m) => m.idMeal).filter((id) => areaIds.has(id));
      if (candidateIds.length === 0) return [];
      const details = await MealAPI.fetchMealDetails(candidateIds);
      return details.filter((d) => d && d.strArea === AREA);
    } catch (error) {
      console.error("Error filtering by ingredient:", error);
      return [];
    }
  },

  // filter by category, constrained to AREA
  filterByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      if (!response.ok) return [];
      const data = await response.json();
      const list = data.meals || [];
      if (list.length === 0) return [];
      // intersect ids with area list to limit detail fetches
      const areaList = await MealAPI.getMealsByArea();
      const areaIds = new Set(areaList.map((m) => m.idMeal));
      const candidateIds = list.map((m) => m.idMeal).filter((id) => areaIds.has(id));
      if (candidateIds.length === 0) return [];
      const details = await MealAPI.fetchMealDetails(candidateIds);
      return details.filter((d) => d && d.strArea === AREA);
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },

  // transform TheMealDB meal data to our app format
  transformMealData: (meal) => {
    if (!meal) return null;

    // extract ingredients from the meal object
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    // extract instructions
    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
