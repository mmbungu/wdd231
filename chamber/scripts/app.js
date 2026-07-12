const url = "https://mmbungu.github.io/wdd231/chamber/data/members.json"

async function getChambers()
{
    const response = await fetch(url);
    const data = await response.json();

    displayChambers(data.companies)
}

const displayChambers = function(companies){
    companies.forEach(company => {
        const cardItem = document.createElement('div')
        cardItem.classList.add('card-item');
        cardItem.innerHTML = `
                    <div class="card-header">
                        <h2>${company.name}</h2>
                        <p>${company.sector}</p>
                    </div>
                    <div class="card-body">
                        <img src="${company.image}" alt="Photo of ${company.name}">
                        <ul>
                            <li><span class="title">Email:</span> ${company.email}</li>
                            <li><span class="title">Phone:</span> ${company.phone}</li>
                            <li><span class="title">Website:</span> <a target="_blank" href="${company.website}">${company.website}</a></li>
                        </ul>
                    </div>
        `
        cardContainer.appendChild(cardItem)
    });
}

getChambers()