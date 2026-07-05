const navButton = document.querySelector("#nav-button")
const navLinks = document.querySelector("#nav-bar")


navButton.addEventListener("click", function() {
    navButton.classList.toggle("show");
    navLinks.classList.toggle("show");
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = "Last modified: " + document.lastModified;