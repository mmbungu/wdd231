const timestampField = document.querySelector("#timestamp");
const inquirySelect = document.querySelector("#inquiry");
const recipeNameLabel = document.querySelector("#recipe-name-label");
const recipeNameInput = document.querySelector("#recipe-name");

if (timestampField) {
    timestampField.value = new Date().toLocaleString();
}

function updateRecipeNameField() {
    if (!inquirySelect || !recipeNameLabel || !recipeNameInput) {
        return;
    }

    if (inquirySelect.value === "suggestion") {
        recipeNameLabel.hidden = false;
        recipeNameInput.required = true;
    } else {
        recipeNameLabel.hidden = true;
        recipeNameInput.required = false;
        recipeNameInput.value = "";
    }
}

if (inquirySelect) {
    inquirySelect.addEventListener("change", updateRecipeNameField);
    updateRecipeNameField();
}

const submittedInfo = document.querySelector(".submitted-info");

if (submittedInfo) {
    const params = new URLSearchParams(window.location.search);

    document.querySelector("#show-firstname").textContent = params.get("firstname") || "";
    document.querySelector("#show-email").textContent = params.get("email") || "";

    const inquiry = params.get("inquiry") || "";
    const inquiryLabels = {
        contact: "General Contact",
        suggestion: "Recipe Suggestion",
    };
    document.querySelector("#show-inquiry").textContent = inquiryLabels[inquiry] || inquiry;

    const recipeName = params.get("recipename") || "";
    const recipeRow = document.querySelector("#show-recipe-row");
    if (recipeName && recipeRow) {
        recipeRow.hidden = false;
        document.querySelector("#show-recipename").textContent = recipeName;
    }

    document.querySelector("#show-message").textContent = params.get("message") || "";
    document.querySelector("#show-timestamp").textContent = params.get("timestamp") || "";
}
