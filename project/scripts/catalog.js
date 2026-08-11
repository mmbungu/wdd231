import {
    getAreas,
    getCategories,
    getMealById,
    getMealsByArea,
    getMealsByCategory,
    loadInitialCatalog,
    searchMeals,
} from "./api.js";
import { isFavorite, toggleFavorite } from "./storage.js";

const catalogContainer = document.querySelector("#catalog-recipes");
const resultsCount = document.querySelector("#results-count");
const filtersForm = document.querySelector("#catalog-filters-form");
const categoryFilter = document.querySelector("#category-filter");
const areaFilter = document.querySelector("#area-filter");
const catalogSearch = document.querySelector("#catalog-search");
const modal = document.querySelector("#recipe-modal");
const modalBody = document.querySelector("#modal-body");
const modalCloseButton = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");

function closeModal() {
    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (modalBody) {
        modalBody.innerHTML = "";
    }
}

function getIngredients(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
        const ingredient = meal[`strIngredient${index}`];
        const measure = meal[`strMeasure${index}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : "",
            });
        }
    }

    return ingredients;
}

function formatInstructions(instructions) {
    return instructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean)
        .map((step) => `<li>${step}</li>`)
        .join("");
}

function buildModalContent(meal) {
    const ingredients = getIngredients(meal);
    const instructions = formatInstructions(meal.strInstructions || "");
    const favoriteLabel = isFavorite(meal.idMeal) ? "Remove Favorite" : "Save Favorite";
    const youtubeLink = meal.strYoutube
        ? `<p><a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>`
        : "";

    return `
        <img class="modal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}" width="600" height="400">
        <h2 id="modal-title">${meal.strMeal}</h2>
        <p class="recipe-meta">${meal.strCategory} · ${meal.strArea}</p>
        <h3>Ingredients</h3>
        <ul class="ingredient-list">
            ${ingredients.map((item) => `<li>${item.measure ? `${item.measure} ` : ""}${item.ingredient}</li>`).join("")}
        </ul>
        <h3>Instructions</h3>
        <ol class="instruction-list">${instructions}</ol>
        ${youtubeLink}
        <button type="button" class="cta modal-favorite-btn" data-id="${meal.idMeal}">${favoriteLabel}</button>
    `;
}

async function openRecipeModal(idMeal) {
    if (!modal || !modalBody) {
        return;
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalBody.innerHTML = `<p class="status-message">Loading recipe details...</p>`;

    try {
        const meal = await getMealById(idMeal);

        if (!meal) {
            modalBody.innerHTML = `<p class="status-message">Recipe not found.</p>`;
            return;
        }

        modalBody.innerHTML = buildModalContent(meal);

        const modalFavoriteButton = modalBody.querySelector(".modal-favorite-btn");
        if (modalFavoriteButton) {
            modalFavoriteButton.addEventListener("click", function () {
                const saved = toggleFavorite(meal);
                modalFavoriteButton.textContent = saved ? "Remove Favorite" : "Save Favorite";

                const cardFavoriteButton = document.querySelector(`.favorite-btn[data-id="${meal.idMeal}"]`);
                if (cardFavoriteButton) {
                    cardFavoriteButton.classList.toggle("is-favorite", saved);
                    cardFavoriteButton.setAttribute("aria-label", saved ? "Remove favorite" : "Save favorite");
                }
            });
        }
    } catch (error) {
        modalBody.innerHTML = `<p class="status-message">Unable to load recipe details.</p>`;
    }
}

function displayMeals(meals) {
    if (!catalogContainer) {
        return;
    }

    catalogContainer.innerHTML = "";

    if (meals.length === 0) {
        catalogContainer.innerHTML = `<p class="status-message">No recipes match your search.</p>`;
        if (resultsCount) {
            resultsCount.textContent = "0 recipes found";
        }
        return;
    }

    meals.forEach((meal) => {
        const category = meal.strCategory || "Uncategorized";
        const area = meal.strArea || "Unknown";
        const favoriteClass = isFavorite(meal.idMeal) ? "is-favorite" : "";
        const card = document.createElement("article");

        card.classList.add("recipe-card");
        card.dataset.id = meal.idMeal;
        card.dataset.category = category;
        card.dataset.area = area;
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" width="300" height="300">
            <div class="recipe-card-body">
                <h3>${meal.strMeal}</h3>
                <p class="recipe-meta">${category} · ${area}</p>
                <div class="recipe-actions">
                    <button type="button" class="cta details-btn" data-id="${meal.idMeal}">View Details</button>
                    <button type="button" class="favorite-btn ${favoriteClass}" data-id="${meal.idMeal}"
                        aria-label="${favoriteClass ? "Remove favorite" : "Save favorite"}">♥</button>
                </div>
            </div>
        `;

        const detailsButton = card.querySelector(".details-btn");
        const favoriteButton = card.querySelector(".favorite-btn");

        detailsButton.addEventListener("click", function () {
            openRecipeModal(meal.idMeal);
        });

        favoriteButton.addEventListener("click", function () {
            const saved = toggleFavorite({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                strCategory: category,
                strArea: area,
            });

            favoriteButton.classList.toggle("is-favorite", saved);
            favoriteButton.setAttribute("aria-label", saved ? "Remove favorite" : "Save favorite");

            const modalFavoriteButton = document.querySelector(`.modal-favorite-btn[data-id="${meal.idMeal}"]`);
            if (modalFavoriteButton) {
                modalFavoriteButton.textContent = saved ? "Remove Favorite" : "Save Favorite";
            }
        });

        catalogContainer.appendChild(card);
    });

    if (resultsCount) {
        resultsCount.textContent = `${meals.length} recipe${meals.length === 1 ? "" : "s"} found`;
    }
}

async function loadCatalog() {
    if (!catalogContainer) {
        return;
    }

    catalogContainer.innerHTML = `<p class="status-message">Loading recipes...</p>`;

    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search") || "";
    const recipeId = params.get("id");
    const category = categoryFilter ? categoryFilter.value : "";
    const area = areaFilter ? areaFilter.value : "";

    if (catalogSearch && searchTerm) {
        catalogSearch.value = searchTerm;
    }

    try {
        let meals = [];

        if (searchTerm) {
            meals = await searchMeals(searchTerm);
        } else if (category) {
            meals = await getMealsByCategory(category);
        } else if (area) {
            meals = await getMealsByArea(area);
        } else {
            meals = await loadInitialCatalog(15);
        }

        if (area && searchTerm) {
            meals = meals.filter((meal) => meal.strArea === area);
        } else if (area && category) {
            meals = meals.filter((meal) => meal.strArea === area);
        }

        displayMeals(meals);

        if (recipeId) {
            openRecipeModal(recipeId);
        }
    } catch (error) {
        catalogContainer.innerHTML = `<p class="status-message">Unable to load recipes. Please try again later.</p>`;
    }
}

async function loadFilterOptions() {
    try {
        const categories = await getCategories();
        const areas = await getAreas();

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categoryFilter.appendChild(option);
        });

        areas.sort().forEach((area) => {
            const option = document.createElement("option");
            option.value = area;
            option.textContent = area;
            areaFilter.appendChild(option);
        });
    } catch (error) {
        if (resultsCount) {
            resultsCount.textContent = "Filter options could not be loaded.";
        }
    }
}

if (filtersForm) {
    filtersForm.addEventListener("submit", function (event) {
        event.preventDefault();
        loadCatalog();
    });
}

if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal && !modal.hidden) {
        closeModal();
    }
});

loadFilterOptions();
loadCatalog();
