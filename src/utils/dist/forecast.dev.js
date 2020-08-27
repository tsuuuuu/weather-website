"use strict";

var request = require('request');

var forecast = function forecast(latitude, longitude, callback) {
  //const url = 'https://api.darksky.net/forecast/' + process.env.DARKSKY_API_KEY + '/' + coordinates + '?lang=pt&units=si&exclude=hourly,flags'
  var url = "https://api.openweathermap.org/data/2.5/onecall?lat=".concat(latitude, "&lon=").concat(longitude, "&lang=pt_br&units=metric&exclude=minutely,hourly&appid=").concat(process.env.OPENWEATHER_API_KEY); //console.log(url)

  request({
    url: url,
    json: true
  }, function (error, _ref) {
    var body = _ref.body;

    if (error) {
      callback('Não foi possível conectar aos serviços metereológicos!', undefined);
    } else if (body.error) {
      callback('Local não encontrado, tente outra busca!', undefined);
    } else {
      if (!body.daily[0].rain) {
        body.daily[0].rain = 0;
      }

      callback(undefined, {
        today: convertTime(body.current.dt),
        todayStatus: body.current.weather[0].description,
        todayTemp: Math.round(body.current.temp * 10) / 10 + '°C',
        todayFeel: Math.round(body.current.feels_like * 10) / 10 + '°C',
        rainChance: Math.round(body.daily[0].pop * 100) + '%',
        rainMm: body.daily[0].rain + 'mm',
        umidity: body.daily[0].humidity + '%',
        minTemp: Math.round(body.daily[0].temp.min * 10) / 10 + '°C',
        maxTemp: Math.round(body.daily[0].temp.max * 10) / 10 + '°C',
        todayId: body.daily[0].weather[0].id,
        d1: convertTime(body.daily[1].dt),
        // Today + 1
        d1W: convertDay(body.daily[1].dt),
        d1Id: body.daily[1].weather[0].id,
        d1Min: Math.round(body.daily[1].temp.min * 10) / 10 + '°C',
        d1Max: Math.round(body.daily[1].temp.max * 10) / 10 + '°C',
        d2: convertTime(body.daily[2].dt),
        // Today + 2
        d2W: convertDay(body.daily[2].dt),
        d2Id: body.daily[2].weather[0].id,
        d2Min: Math.round(body.daily[2].temp.min * 10) / 10 + '°C',
        d2Max: Math.round(body.daily[2].temp.max * 10) / 10 + '°C',
        d3: convertTime(body.daily[3].dt),
        // Today + 3
        d3W: convertDay(body.daily[3].dt),
        d3Id: body.daily[3].weather[0].id,
        d3Min: Math.round(body.daily[3].temp.min * 10) / 10 + '°C',
        d3Max: Math.round(body.daily[3].temp.max * 10) / 10 + '°C',
        d4: convertTime(body.daily[4].dt),
        // Today + 4
        d4W: convertDay(body.daily[4].dt),
        d4Id: body.daily[4].weather[0].id,
        d4Min: Math.round(body.daily[4].temp.min * 10) / 10 + '°C',
        d4Max: Math.round(body.daily[4].temp.max * 10) / 10 + '°C',
        d5: convertTime(body.daily[5].dt),
        // Today + 5
        d5W: convertDay(body.daily[5].dt),
        d5Id: body.daily[5].weather[0].id,
        d5Min: Math.round(body.daily[5].temp.min * 10) / 10 + '°C',
        d5Max: Math.round(body.daily[5].temp.max * 10) / 10 + '°C',
        d6: convertTime(body.daily[6].dt),
        // Today + 6
        d6W: convertDay(body.daily[6].dt),
        d6Id: body.daily[6].weather[0].id,
        d6Min: Math.round(body.daily[6].temp.min * 10) / 10 + '°C',
        d6Max: Math.round(body.daily[6].temp.max * 10) / 10 + '°C',
        d7: convertTime(body.daily[7].dt),
        // Today + 7
        d7W: convertDay(body.daily[7].dt),
        d7Id: body.daily[7].weather[0].id,
        d7Min: Math.round(body.daily[7].temp.min * 10) / 10 + '°C',
        d7Max: Math.round(body.daily[7].temp.max * 10) / 10 + '°C'
      });
    }
  });
};

function convertTime(timestamp) {
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hours = Math.trunc(date.getHours());
  var minutes = date.getMinutes();
  return "".concat(day, "/").concat(month); // return `${day}/${month}/${year}-${hours}:${minutes}`
}

function convertDay(timestamp) {
  var date = new Date(timestamp * 1000);

  switch (date.getDay()) {
    case 0:
      return 'Dom';

    case 1:
      return 'Seg';

    case 2:
      return 'Ter';

    case 3:
      return 'Qua';

    case 4:
      return 'Qui';

    case 5:
      return 'Sex';

    case 6:
      return 'Sáb';
  }
}

module.exports = forecast;