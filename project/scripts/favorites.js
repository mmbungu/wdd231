import { getFavorites, removeFavorite } from "./storage.js";

const favoritesContainer = document.querySelector("#favorites-recipes");
const favoritesCount = document.querySelector("#favorites-count");
const emptyState = document.querySelector("#favorites-empty");

function displayFavorites() {
    if (!favoritesContainer) {
        return;
    }

    const favorites = getFavorites();
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        if (emptyState) {
            emptyState.hidden = false;
        }

        if (favoritesCount) {
            favoritesCount.textContent = "0 saved recipes";
        }

        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    if (favoritesCount) {
        favoritesCount.textContent = `${favorites.length} saved recipe${favorites.length === 1 ? "" : "s"}`;
    }

    favorites.forEach((meal) => {
        const category = meal.strCategory || "Uncategorized";
        const area = meal.strArea || "Unknown";
        const card = document.createElement("article");

        card.classList.add("recipe-card");
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" width="300" height="300">
            <div class="recipe-card-body">
                <h3>${meal.strMeal}</h3>
                <p class="recipe-meta">${category} · ${area}</p>
                <div class="recipe-actions">
                    <a class="cta recipe-link" href="catalog.html?id=${meal.idMeal}">View Details</a>
                    <button type="button" class="favorite-btn is-favorite" data-id="${meal.idMeal}"
                        aria-label="Remove favorite">♥</button>
                </div>
            </div>
        `;

        const removeButton = card.querySelector(".favorite-btn");

        removeButton.addEventListener("click", function () {
            removeFavorite(meal.idMeal);
            card.remove();

            const remaining = getFavorites();

            if (favoritesCount) {
                favoritesCount.textContent = `${remaining.length} saved recipe${remaining.length === 1 ? "" : "s"}`;
            }

            if (remaining.length === 0 && emptyState) {
                emptyState.hidden = false;
            }
        });

        favoritesContainer.appendChild(card);
    });
}

displayFavorites();
