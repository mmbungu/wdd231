const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector("#cards");

async function getProphetData(){
    const response = await fetch(url);
    const data = await response.json();
    displayProphets(data.prophets);
}


const displayProphets = (prophets) => {
    prophets.forEach(prophet => {
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthDate = document.createElement('span');
        let birthPlace = document.createElement('span');

        let prophetFullName = `Portrait of ${prophet.name} ${prophet.lastname}`

        fullName.textContent = prophetFullName;

        portrait.src = prophet.imageurl;
        portrait.loading = 'lazy';
        portrait.alt = prophetFullName;
        portrait.setAttribute('width', 340);
        portrait.setAttribute('height', 440);

        birthDate.textContent = `Date Of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place Of Birth: ${prophet.birthplace}`;
        
        card.appendChild(fullName);

        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        
        card.appendChild(portrait)

        cards.appendChild(card)
    });
}

getProphetData()