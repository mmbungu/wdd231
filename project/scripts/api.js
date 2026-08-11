const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
}

export const getRandomMeal = async () => {
    const data = await fetchJson(`${API_BASE}/random.php`);
    return data.meals ? data.meals[0] : null;
}

export const getRandomMeals = async (count) => {
    const meals = [];
    const seenIds = [];
    let attempts = 0;
    const maxAttempts = count * 4;

    while (meals.length < count && attempts < maxAttempts) {
        attempts += 1;
        const meal = await getRandomMeal();

        if (meal && !seenIds.includes(meal.idMeal)) {
            seenIds.push(meal.idMeal);
            meals.push(meal);
        }
    }

    return meals;
}

export const getCategories = async () => {
    const data = await fetchJson(`${API_BASE}/categories.php`);
    return data.categories ? data.categories : [];
}

export const getAreas = async () => {
    const data = await fetchJson(`${API_BASE}/list.php?a=list`);
    return data.meals ? data.meals.map((item) => item.strArea) : [];
}

export const getMealsByCategory = async (category) => {
    const data = await fetchJson(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    return data.meals ? data.meals.map((meal) => ({ ...meal, strCategory: category })) : [];
}

export const getMealsByArea = async (area) => {
    const data = await fetchJson(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    return data.meals ? data.meals.map((meal) => ({ ...meal, strArea: area })) : [];
}

export const searchMeals = async (term) => {
    const data = await fetchJson(`${API_BASE}/search.php?s=${encodeURIComponent(term)}`);
    return data.meals ? data.meals : [];
}

export const getMealById = async (id) => {
    const data = await fetchJson(`${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`);
    return data.meals ? data.meals[0] : null;
}

export const loadInitialCatalog = async (minCount = 15) => {
    const categories = ["Seafood", "Chicken", "Dessert"];
    const meals = [];
    const seenIds = new Set();

    for (const category of categories) {
        const categoryMeals = await getMealsByCategory(category);

        categoryMeals.forEach((meal) => {
            if (!seenIds.has(meal.idMeal)) {
                seenIds.add(meal.idMeal);
                meals.push(meal);
            }
        });

        if (meals.length >= minCount) {
            break;
        }
    }

    return meals.slice(0, Math.max(minCount, meals.length));
}
