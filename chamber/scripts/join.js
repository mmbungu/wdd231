const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toLocaleString();
}

document.querySelectorAll("[data-modal]").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        const modal = document.getElementById(this.getAttribute('data-modal'));
        if (modal) {
            modal.showModal();
        }
    });
});

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", function() {
        this.closest("dialog").close();
    });
});

const submittedInfo = document.querySelector(".submitted-info");

if (submittedInfo) {
    const params = new URLSearchParams(window.location.search);

    document.querySelector("#show-firstname").textContent = params.get("firstname") || "";
    document.querySelector("#show-lastname").textContent = params.get("lastname") || "";
    document.querySelector("#show-email").textContent = params.get("email") || "";
    document.querySelector("#show-phone").textContent = params.get("phone") || "";
    document.querySelector("#show-organization").textContent = params.get("organization") || "";
    document.querySelector("#show-timestamp").textContent = params.get("timestamp") || "";
}
