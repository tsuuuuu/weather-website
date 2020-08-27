"use strict";

var path = require('path');

var express = require('express');

var hbs = require('hbs');

var _require = require('./utils/geocode'),
    geocode = _require.geocode,
    revGeocode = _require.revGeocode;

var forecast = require('./utils/forecast');

var app = express();
var port = process.env.PORT || 3000; // Define paths for Express config

var publicDirectoryPath = path.join(__dirname, '../public');
var viewsPath = path.join(__dirname, '../templates/views');
var partialsPath = path.join(__dirname, '../templates/partials'); // Setup handlebars engine and views location

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath); // Setup static directory to serve

app.use(express["static"](publicDirectoryPath));
app.get('', function (req, res) {
  res.render('index', {
    title: 'Previsão do tempo',
    name: 'Tsuyoshi'
  });
});
app.get('/about', function (req, res) {
  res.render('about', {
    title: 'Sobre esta página',
    name: 'Tsuyoshi'
  });
});
app.get('/contact', function (req, res) {
  res.render('contact', {
    title: 'Contato',
    name: 'Tsuyoshi'
  });
});
app.get('/help', function (req, res) {
  res.render('help', {
    title: 'Ajuda',
    name: 'Tsuyoshi',
    message: 'This is the help page'
  });
});
app.get('/weather', function (req, res) {
  if (!req.query.address && !req.query.coords) {
    return res.send({
      error: "Você deve fornecer uma localização!"
    });
  }

  if (!req.query.coords) {
    var location = req.query.address;
    geocode(location, function (error) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          latitude = _ref.latitude,
          longitude = _ref.longitude,
          location = _ref.location;

      if (error) {
        return res.send(error);
      } //console.log(data)


      forecast(latitude, longitude, function (error, forecastData) {
        if (error) {
          return res.send(error);
        }

        res.send({
          Location: location,
          Forecast: forecastData
        });
      });
    });
  } else {
    var _location = req.query.coords;

    var locArray = _location.split(',');

    var latitude = locArray[0].slice(0, 11);
    var longitude = locArray[1].slice(0, 11); //console.log(location)

    var revGeolocation = revGeocode(latitude, longitude, function (error, _ref2) {
      var city = _ref2.city,
          county = _ref2.county;

      if (error) {
        return res.send(error);
      }

      forecast(latitude, longitude, function (error, forecastData) {
        if (error) {
          return res.send(error);
        }

        res.send({
          Location: "".concat(city, " - ").concat(county),
          Forecast: forecastData
        });
      });
    });
  }
}); // app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: "You must provide a search term"
//         })
//     }
//     console.log(req.query.search)
//     res.send ({
//         products: []
//     })
// })

app.get('/help/*', function (req, res) {
  res.render('404', {
    title: 'Error 404',
    name: 'Tsuyoshi',
    message: 'Erro 404 - Página de ajuda não encontrada'
  });
});
app.get('*', function (req, res) {
  res.render('404', {
    title: 'Error 404',
    name: 'Tsuyoshi',
    message: 'Erro 404 - Página não encontrada'
  });
});
app.listen(port, function () {
  console.log('Server is up on port ' + port);
});