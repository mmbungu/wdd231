const url = "https://mmbungu.github.io/wdd231/chamber/data/members.json"
const apiKey = "bdb5159c63985a2a17a3da3c030c9e85"
const lat = -4.322447
const lon = 15.313364
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

const spotlights = document.querySelector("#spotlights")

async function getChambers()
{
    const response = await fetch(url);
    const data = await response.json();

    return data.companies;
}

async function getWeather()
{
    const weatherResponse = await fetch(weatherUrl);
    const forecastResponse = await fetch(forecastUrl);
    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    displayWeather(weatherData, forecastData);
}

const getMembershipLabel = function(level) {
    if (level === 3) return "Gold";
    if (level === 2) return "Silver";
    return "Member";
}

const getRandomSpotlights = function(companies) {
    const eligible = companies.filter(company => company.level === 2 || company.level === 3);
    const count = Math.floor(Math.random() * 2) + 2;

    return eligible
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

const getThreeDayForecast = function(list) {
    return list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 3);
}

const displayWeather = function(current, forecast) {
    const weatherInfo = document.querySelector("#weather-info");
    if (!weatherInfo) return;

    const icon = current.weather[0].icon;
    const description = current.weather[0].description;
    const temperature = Math.round(current.main.temp);
    const humidity = current.main.humidity;
    const wind = current.wind.speed;
    const forecastDays = getThreeDayForecast(forecast.list);

    const forecastHtml = forecastDays.map(day => {
        const dayName = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
        const dayTemp = Math.round(day.main.temp);
        const dayDescription = day.weather[0].description;
        const dayIcon = day.weather[0].icon;

        return `
            <span class="weather-forecast-day">
                <strong class="weather-forecast-day-label">${dayName}</strong>
                <img class="weather-forecast-day-icon" src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${dayDescription}">
                <span class="weather-forecast-day-temperature">${dayTemp}&deg;C</span>
                <span class="weather-forecast-day-description">${dayDescription}</span>
            </span>
        `;
    }).join("");

    weatherInfo.innerHTML = `
        <div class="weather-current">
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <span class="weather-temperature">${temperature}&deg;C</span>
            <span class="weather-description">${description}</span>
            <span class="weather-humidity">Humidity: ${humidity}%</span>
            <span class="weather-wind">Wind: ${wind} m/s</span>
        </div>
        <h3 class="weather-forecast-title">3-Day Forecast</h3>
        <div class="weather-forecast">
            ${forecastHtml}
        </div>
    `;
}

const displayChambers = function(companies, internalCardContainer) {
    companies.forEach(company => {
        const cardItem = document.createElement("div");
        cardItem.classList.add("card-item");
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
        `;
        internalCardContainer.appendChild(cardItem);
    });
}

getChambers().then(chambers => {
    if (cardContainer) {
        displayChambers(chambers, cardContainer);
    }
    if (spotlights) {
        displayChambers(getRandomSpotlights(chambers), spotlights)
        // displaySpotlights(chambers);
    }
});

getWeather();
