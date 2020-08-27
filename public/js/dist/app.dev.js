"use strict";

console.log('Client side javascript file is loaded!');
var weatherForm = document.querySelector('form');
var search = document.querySelector('input');
var locationBtn = document.querySelector('#location');
var flipCard = document.querySelector('#flip-card');
var flipIcon = document.querySelector('#weather-icon');
var minTemp = document.querySelector('#min');
var maxTemp = document.querySelector('#max');
var message = document.querySelector('#message');
var loader = document.querySelector('#loader');
var forecast = document.querySelector('#forecast');
var nextDays = document.querySelector('#next-days');
var day1 = document.querySelector('#day1');
var day2 = document.querySelector('#day2');
var day3 = document.querySelector('#day3');
var day4 = document.querySelector('#day4');
var day5 = document.querySelector('#day5');
var day6 = document.querySelector('#day6');
var day7 = document.querySelector('#day7');
var day1W = document.querySelector('#day-w1');
var day2W = document.querySelector('#day-w2');
var day3W = document.querySelector('#day-w3');
var day4W = document.querySelector('#day-w4');
var day5W = document.querySelector('#day-w5');
var day6W = document.querySelector('#day-w6');
var day7W = document.querySelector('#day-w7');
var d1Icon = document.querySelector('#day1-icon');
var d1Min = document.querySelector('#d1-min');
var d1Max = document.querySelector('#d1-max');
var d2Icon = document.querySelector('#day2-icon');
var d2Min = document.querySelector('#d2-min');
var d2Max = document.querySelector('#d2-max');
var d3Icon = document.querySelector('#day3-icon');
var d3Min = document.querySelector('#d3-min');
var d3Max = document.querySelector('#d3-max');
var d4Icon = document.querySelector('#day4-icon');
var d4Min = document.querySelector('#d4-min');
var d4Max = document.querySelector('#d4-max');
var d5Icon = document.querySelector('#day5-icon');
var d5Min = document.querySelector('#d5-min');
var d5Max = document.querySelector('#d5-max');
var d6Icon = document.querySelector('#day6-icon');
var d6Min = document.querySelector('#d6-min');
var d6Max = document.querySelector('#d6-max');
var d7Icon = document.querySelector('#day7-icon');
var d7Min = document.querySelector('#d7-min');
var d7Max = document.querySelector('#d7-max');
weatherForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var location = search.value;
  message.style.display = 'block';
  message.textContent = 'Carregando...';
  flipCard.style.display = 'none';
  nextDays.style.display = 'none';
  loader.style.display = 'block';
  forecast.textContent = '';
  fetch('/weather?address=' + location).then(function (response) {
    response.json().then(function (data) {
      if (data.error) {
        message.textContent = data.error;
      } else {
        // loader.style.width = '400px'
        loader.style.display = 'none';
        message.textContent = data.Location;
        flipIcon.src = icon(data.Forecast.todayId);
        minTemp.textContent = data.Forecast.minTemp;
        maxTemp.textContent = data.Forecast.maxTemp;
        forecast.textContent = '\n' + 'Agora: ' + JSON.parse(JSON.stringify(data.Forecast.todayStatus)) + '\n\n' + 'Temperatura: ' + JSON.parse(JSON.stringify(data.Forecast.todayTemp)) + '\n\n' + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.todayFeel)) + '\n\n' + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.rainChance)) + '\n\n' + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.rainMm)) + '\n\n' + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.umidity));
        flipCard.style.display = 'inline-block';
        forecast.style.height = '250px';
        day1.textContent = JSON.parse(JSON.stringify(data.Forecast.d1));
        day2.textContent = JSON.parse(JSON.stringify(data.Forecast.d2));
        day3.textContent = JSON.parse(JSON.stringify(data.Forecast.d3));
        day4.textContent = JSON.parse(JSON.stringify(data.Forecast.d4));
        day5.textContent = JSON.parse(JSON.stringify(data.Forecast.d5));
        day6.textContent = JSON.parse(JSON.stringify(data.Forecast.d6));
        day7.textContent = JSON.parse(JSON.stringify(data.Forecast.d7));
        day1W.textContent = JSON.parse(JSON.stringify(data.Forecast.d1W));
        day2W.textContent = JSON.parse(JSON.stringify(data.Forecast.d2W));
        day3W.textContent = JSON.parse(JSON.stringify(data.Forecast.d3W));
        day4W.textContent = JSON.parse(JSON.stringify(data.Forecast.d4W));
        day5W.textContent = JSON.parse(JSON.stringify(data.Forecast.d5W));
        day6W.textContent = JSON.parse(JSON.stringify(data.Forecast.d6W));
        day7W.textContent = JSON.parse(JSON.stringify(data.Forecast.d7W));
        d1Icon.src = icon(data.Forecast.d1Id);
        d1Min.textContent = data.Forecast.d1Min;
        d1Max.textContent = data.Forecast.d1Max;
        d2Icon.src = icon(data.Forecast.d2Id);
        d2Min.textContent = data.Forecast.d2Min;
        d2Max.textContent = data.Forecast.d2Max;
        d3Icon.src = icon(data.Forecast.d3Id);
        d3Min.textContent = data.Forecast.d3Min;
        d3Max.textContent = data.Forecast.d3Max;
        d4Icon.src = icon(data.Forecast.d4Id);
        d4Min.textContent = data.Forecast.d4Min;
        d4Max.textContent = data.Forecast.d4Max;
        d5Icon.src = icon(data.Forecast.d5Id);
        d5Min.textContent = data.Forecast.d5Min;
        d5Max.textContent = data.Forecast.d5Max;
        d6Icon.src = icon(data.Forecast.d6Id);
        d6Min.textContent = data.Forecast.d6Min;
        d6Max.textContent = data.Forecast.d6Max;
        d7Icon.src = icon(data.Forecast.d7Id);
        d7Min.textContent = data.Forecast.d7Min;
        d7Max.textContent = data.Forecast.d7Max;
        nextDays.style.display = 'inline-block';
        console.log(data.Forecast);
      }
    });
  });
});
locationBtn.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocalização não suportada pelo seu navegador!');
  }

  message.style.display = 'block';
  message.textContent = 'Carregando...';
  flipCard.style.display = 'none';
  nextDays.style.display = 'none';
  loader.style.display = 'block';
  forecast.textContent = '';
  navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    fetch('/weather?coords=' + latitude + ',' + longitude).then(function (response) {
      response.json().then(function (data) {
        if (data.error) {
          message.textContent = data.error;
        } else {
          loader.style.display = 'none';
          message.textContent = data.Location;
          flipIcon.src = icon(data.Forecast.todayId);
          minTemp.textContent = data.Forecast.minTemp;
          maxTemp.textContent = data.Forecast.maxTemp;
          forecast.textContent = '\n' + 'Agora: ' + JSON.parse(JSON.stringify(data.Forecast.todayStatus)) + '\n\n' + 'Temperatura: ' + JSON.parse(JSON.stringify(data.Forecast.todayTemp)) + '\n\n' + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.todayFeel)) + '\n\n' + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.rainChance)) + '\n\n' + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.rainMm)) + '\n\n' + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.umidity));
          flipCard.style.display = 'inline-block';
          forecast.style.height = '250px';
          day1.textContent = JSON.parse(JSON.stringify(data.Forecast.d1));
          day2.textContent = JSON.parse(JSON.stringify(data.Forecast.d2));
          day3.textContent = JSON.parse(JSON.stringify(data.Forecast.d3));
          day4.textContent = JSON.parse(JSON.stringify(data.Forecast.d4));
          day5.textContent = JSON.parse(JSON.stringify(data.Forecast.d5));
          day6.textContent = JSON.parse(JSON.stringify(data.Forecast.d6));
          day7.textContent = JSON.parse(JSON.stringify(data.Forecast.d7));
          day1W.textContent = JSON.parse(JSON.stringify(data.Forecast.d1W));
          day2W.textContent = JSON.parse(JSON.stringify(data.Forecast.d2W));
          day3W.textContent = JSON.parse(JSON.stringify(data.Forecast.d3W));
          day4W.textContent = JSON.parse(JSON.stringify(data.Forecast.d4W));
          day5W.textContent = JSON.parse(JSON.stringify(data.Forecast.d5W));
          day6W.textContent = JSON.parse(JSON.stringify(data.Forecast.d6W));
          day7W.textContent = JSON.parse(JSON.stringify(data.Forecast.d7W));
          d1Icon.src = icon(data.Forecast.d1Id);
          d1Min.textContent = data.Forecast.d1Min;
          d1Max.textContent = data.Forecast.d1Max;
          d2Icon.src = icon(data.Forecast.d2Id);
          d2Min.textContent = data.Forecast.d2Min;
          d2Max.textContent = data.Forecast.d2Max;
          d3Icon.src = icon(data.Forecast.d3Id);
          d3Min.textContent = data.Forecast.d3Min;
          d3Max.textContent = data.Forecast.d3Max;
          d4Icon.src = icon(data.Forecast.d4Id);
          d4Min.textContent = data.Forecast.d4Min;
          d4Max.textContent = data.Forecast.d4Max;
          d5Icon.src = icon(data.Forecast.d5Id);
          d5Min.textContent = data.Forecast.d5Min;
          d5Max.textContent = data.Forecast.d5Max;
          d6Icon.src = icon(data.Forecast.d6Id);
          d6Min.textContent = data.Forecast.d6Min;
          d6Max.textContent = data.Forecast.d6Max;
          d7Icon.src = icon(data.Forecast.d7Id);
          d7Min.textContent = data.Forecast.d7Min;
          d7Max.textContent = data.Forecast.d7Max;
          nextDays.style.display = 'inline-block';
          console.log(data.Forecast);
        }
      });
    });
  });
});

var icon = function icon(code) {
  if (code < 300) {
    // Thunderstorms
    return '/img/weather/stormy-weather.gif';
  } else if (code < 400) {
    // Drizzle
    return '/img/weather/rainy-weather.gif';
  } else if (code < 600) {
    // Rain
    return '/img/weather/rainy-weather.gif';
  } else if (code < 700) {
    // Snow
    return '/img/weather/light-snowy-weather.gif';
  } else if (code < 800) {
    // Fog
    return '/img/weather/haze-weather.gif';
  } else if (code == 800) {
    // Clear
    return '/img/weather/sun-weather.gif';
  } else if (code > 800) {
    // Clouds
    return '/img/weather/cloudy-weather.gif';
  }
};