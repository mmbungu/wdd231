const navButton = document.querySelector("#nav-button");
const navLinks = document.querySelector("#nav-bar");

if (navButton && navLinks) {
    navButton.addEventListener("click", function () {
        navButton.classList.toggle("show");
        navLinks.classList.toggle("show");
    });
}

const currentYear = document.querySelector("#currentYear");
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const lastModified = document.querySelector("#lastModified");
if (lastModified) {
    lastModified.textContent = `Last modified: ${document.lastModified}`;
}
