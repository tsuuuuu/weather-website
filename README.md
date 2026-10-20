# Hayashi Weather App

A 7-day weather forecast site in Portuguese. I built it while taking Andrew Mead's Node.js course on Udemy.

Search for a place, or use the browser's location, to see today's weather and the next 7 days.

## Stack

- [Express 5](https://expressjs.com/) with [Handlebars](https://github.com/pillarjs/hbs) templates
- [Open-Meteo](https://open-meteo.com/) for the forecast and place search
- [Nominatim](https://nominatim.org/) (OpenStreetMap) to turn the browser's coordinates into a city name

None of these APIs need a key, so there is nothing to configure.

## Running it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # restarts on code changes
npm start        # production
```

Then open http://localhost:3000. Set `PORT` to use a different port.

## Scripts

| Script           | What it does                                                 |
| ---------------- | ------------------------------------------------------------ |
| `npm test`       | Runs the tests with Node's built-in test runner (no network) |
| `npm run lint`   | Runs ESLint                                                  |
| `npm run format` | Formats everything with Prettier                             |

## Layout

```
src/
  server.js           starts the HTTP server
  app.js              Express setup (views, static files, routes)
  routes/             page routes and the /weather JSON endpoint
  services/           calls to Open-Meteo and Nominatim
  lib/                formatting, weather codes, fetch helper
templates/
  views/layout.hbs    shared page shell
  views/*.hbs         one template per page
  partials/           header and footer
public/               CSS, browser JavaScript and images
test/
```

### `GET /weather`

`?address=Campinas` or `?lat=-22.9&lon=-47.06`

```json
{
    "location": "Campinas, São Paulo, Brasil",
    "today": { "date": "20/10", "description": "Céu limpo", "temperature": "24.4°C", "...": "..." },
    "days": [
        {
            "date": "21/10",
            "weekday": "Qua",
            "icon": "/img/weather/sun-weather.gif",
            "min": "18°C",
            "max": "29°C"
        }
    ]
}
```

Errors return a 4xx/5xx status with `{ "error": "message" }`.
