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
