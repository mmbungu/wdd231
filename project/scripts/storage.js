const STORAGE_KEY = "flavorshelf-favorites";

export const getFavorites = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

const saveFavorites = (favorites) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export const isFavorite = (idMeal) => {
    return getFavorites().some((favorite) => favorite.idMeal === idMeal);
}

export const addFavorite = (meal) => {
    if (isFavorite(meal.idMeal)) {
        return;
    }

    const favorites = getFavorites();
    favorites.push({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory || "",
        strArea: meal.strArea || "",
    });
    saveFavorites(favorites);
}

export const removeFavorite = (idMeal) => {
    const favorites = getFavorites().filter((favorite) => favorite.idMeal !== idMeal);
    saveFavorites(favorites);
}

export const toggleFavorite = (meal) => {
    if (isFavorite(meal.idMeal)) {
        removeFavorite(meal.idMeal);
        return false;
    }

    addFavorite(meal);
    return true;
}
