import { places } from "../data/places.mjs";

const gallery = document.querySelector("#discover-gallery");
const visitMessage = document.querySelector("#visit-message");

function displayVisitMessage() {
    const now = Date.now();
    const lastVisit = Number(localStorage.getItem("discover-last-visit"));
    const msPerDay = 1000 * 60 * 60 * 24;

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((now - lastVisit) / msPerDay);

        if (daysBetween < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysBetween === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent = `You last visited ${daysBetween} days ago.`;
        }
    }

    localStorage.setItem("discover-last-visit", now);
}

function displayPlaces(items) {
    items.forEach(place => {
        const card = document.createElement("article");
        card.classList.add("discover-card");
        card.style.gridArea = place.id;

        card.innerHTML = `
            <h2>${place.name}</h2>
            <figure>
                <img src="${place.image}" alt="${place.name}" width="300" height="200" loading="lazy">
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button type="button" data-url="${place.url}">Learn More</button>
        `;

        gallery.appendChild(card);
    });

    gallery.querySelectorAll("button[data-url]").forEach(button => {
        button.addEventListener("click", () => {
            window.open(button.dataset.url, "_blank", "noopener,noreferrer");
        });
    });
}

displayVisitMessage();
displayPlaces(places);
