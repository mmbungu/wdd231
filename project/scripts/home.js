import { getRandomMeals } from "./api.js";

const featuredContainer = document.querySelector("#featured-recipes");
const searchForm = document.querySelector("#search-form");

function createRecipeCard(meal) {
    return `
        <article class="recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" width="300" height="300">
            <div class="recipe-card-body">
                <h3>${meal.strMeal}</h3>
                <p class="recipe-meta">${meal.strCategory} · ${meal.strArea}</p>
                <a class="recipe-link" href="catalog.html?id=${meal.idMeal}">View in Catalog</a>
            </div>
        </article>
    `;
}

async function loadFeaturedRecipes() {
    if (!featuredContainer) {
        return;
    }

    featuredContainer.innerHTML = `<p class="status-message">Loading featured recipes...</p>`;

    try {
        const meals = await getRandomMeals(3);

        if (meals.length === 0) {
            featuredContainer.innerHTML = `<p class="status-message">No recipes found.</p>`;
            return;
        }

        featuredContainer.innerHTML = meals.map(createRecipeCard).join("");
    } catch (error) {
        featuredContainer.innerHTML = `<p class="status-message">Unable to load recipes. Please try again later.</p>`;
    }
}

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const searchInput = document.querySelector("#search-input");
        const term = searchInput.value.trim();

        if (term) {
            window.location.href = `catalog.html?search=${encodeURIComponent(term)}`;
        }
    });
}

loadFeaturedRecipes();
