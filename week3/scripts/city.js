const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const weatherDesc = document.querySelector('figCaption');

const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75590900854184&lon=6.637097107812418&appid=bdb5159c63985a2a17a3da3c030c9e85&units=metric'

async function apiFetch()
{
    try{
        const response = await fetch(url);
        if(response.ok){
            const data = await response.json();
            displayResult(data)
        }else{
            throw Error(await response.text());
        }

    }catch(error)
    {
        console.log(error);
    }
}

function displayResult(data)
{
    currentTemp.textContent = data.main.temp;
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    weatherIcon.setAttribute('width', "80px");
    weatherIcon.setAttribute('height', "80px");
    weatherDesc.textContent = data.weather[0].description;
}

apiFetch()