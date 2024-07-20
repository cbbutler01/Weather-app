const resultTextEl = document.querySelector('#result-text');
const resultContentEl = document.querySelector('#result-content');
const searchFormEl = document.querySelector('#search-form');
const searchHistoryEl = document.querySelector('#previous-searches')
let searchHistory = [];
const API_KEY = 'a63e02948eb23d46e6895bc17cbb112f'; 

function getParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q');
  
  if (query) {
    searchApi(query);
  } else {
    console.error('No search query provided.');
  }
}

function createForecastCard(forecast, isToday, forecastDate, forecastDateString) {
    const resultCard = document.createElement('div');
    resultCard.classList.add('card', 'mb-3', 'p-3');
    resultCard.classList.add(isToday ? 'bg-light' : 'bg-dark');
    resultCard.classList.add(isToday ? 'text-dark' : 'text-light');
  
    const resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.appendChild(resultBody);
  
    const iconImage = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  
    const forecastItem = document.createElement('div');
    forecastItem.innerHTML = `<h5>Date: ${forecastDate.toLocaleDateString()}</h5>
    <img src="${iconImage}" alt="Weather Icon"><br/>
    <strong>Humidity:</strong> ${forecast.main.humidity}%<br/>
    <strong>Wind:</strong> ${forecast.wind.speed}m/h<br/>
    <strong>Temperature:</strong> ${forecast.main.temp} &deg;F<br/>`;
  
    resultBody.appendChild(forecastItem);
    resultContentEl.appendChild(resultCard);
  }
  

function printResults(weatherData) {
 console.log(weatherData);

 resultContentEl.innerHTML = '';
    
 const titleEl = document.createElement('h3');
 titleEl.textContent = weatherData.city.name;
 resultContentEl.appendChild(titleEl);

 const today = new Date();
 const processedDates = {};
 console.log(processedDates)
 let todaysForecastDisplayed = false;
    
  weatherData.list.forEach(forecast => {
   const forecastDate = new Date(forecast.dt * 1000);
   const forecastDateString = forecastDate.toISOString().split('T')[0];

   if (!todaysForecastDisplayed && forecastDate.getDate() === today.getDate()) {
    // Create new card for today's forecast
    createForecastCard(forecast, true, forecastDate, forecastDateString);
    todaysForecastDisplayed = true; // Mark today's forecast as displayed 
  }
});
weatherData.list.forEach(forecast => {
    const forecastDate = new Date((forecast.dt * 1000) + 86400000);
    const forecastDateString = forecastDate.toISOString().split('T')[0];
  if (!processedDates[forecastDateString]) {
    createForecastCard(forecast, false, forecastDate, forecastDateString);
    processedDates[forecastDateString] = true;
    }
});

 if (!searchHistory.includes(weatherData.city.name)){
    searchHistory.push(weatherData.city.name);
 };
 searchHistoryEl.innerHTML = '';

  searchHistory.forEach(query => {
    const history = document.createElement('button');
    history.textContent = query;
    history.classList.add('btn', 'btn-secondary', 'mr-2', 'mb-2');
    history.addEventListener('click', () => {
        searchApi(query);
    });
    searchHistoryEl.appendChild(history);
  });
}
  

function searchApi(query) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=imperial`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      printResults(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      resultContentEl.innerHTML = '<h3>Error fetching weather data, please try again.</h3>';
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInputVal = document.querySelector('#search-input').value.trim();

  if (searchInputVal) {
    const queryString = `?q=${searchInputVal}`;
    history.pushState(null, null, queryString); 
    getParams();
  } else {
    console.error('You need to enter a location.');
  }
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

getParams();
