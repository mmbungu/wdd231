const navButton = document.querySelector("#nav-button")
const navLinks = document.querySelector("#nav-bar")
const modeButton = document.querySelector("#mode-button")

const gridFilterButton = document.querySelector('#grid')
const listFilterButton = document.querySelector('#list')
const cardContainer = document.querySelector('#card-container')

document.querySelectorAll('.menu button').forEach((button)=>{
    button.addEventListener('click', function(event){
        if(event.target.getAttribute('id') == 'grid'){
            cardContainer.classList.add('card-grid')
            cardContainer.classList.remove('card-list')
        }else{
            cardContainer.classList.add('card-list')
            cardContainer.classList.remove('card-grid')    
        }
    })
})

navButton.addEventListener("click", function() {
    navButton.classList.toggle("show");
    navLinks.classList.toggle("show");
});

modeButton.addEventListener("click", function(){
    modeButton.classList.toggle('open')
})

document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = "Last modified: " + document.lastModified;