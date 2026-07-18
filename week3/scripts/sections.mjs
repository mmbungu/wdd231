export function setSectionSelection(selections) {
  const sectionSelect = document.querySelector("#sectionNumber");
    selections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNumber;
    option.textContent = `${section.sectionNumber}`;
    sectionSelect.appendChild(option);
  });
}