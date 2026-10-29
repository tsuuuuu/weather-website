# Hayashi Weather

Current conditions, a 24-hour chart and a 7-day forecast for any city, with a sky in the background that changes with the weather and the time of day.

Version 2 is a rewrite as a static React app. It started as a project for Andrew Mead's Node.js course on Udemy; version 1 (Express + Handlebars) is in the git history.

## Features

- City search with autocomplete, plus "use my location"
- Current conditions: temperature, feels like, humidity, wind, UV index, pressure, visibility, sunrise and sunset
- Hourly chart for the next 24 hours, or for any day you pick in the 7-day list
- Favorites and recent places, saved in the browser
- Shareable links: the address bar always points to the place you are viewing
- °C / °F toggle
- Animated background: clear, cloudy, rain, storm, snow and fog skies, with dawn, dusk and starry night variants
- Respects "reduce motion" settings; works on phones

## Data sources

- [Open-Meteo](https://open-meteo.com/) for forecasts and place search
- [Nominatim](https://nominatim.org/) (© OpenStreetMap contributors) to name the place when you use your location

Neither needs an API key, and the browser calls them directly, so there is no backend.

## Running it

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (http://localhost:5173 by default).

## Scripts

| Script            | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Starts the dev server with hot reload               |
| `npm run build`   | Type-checks and builds the static site into `dist/` |
| `npm run preview` | Serves the built site locally                       |
| `npm test`        | Runs the tests with Vitest (no network)             |
| `npm run lint`    | Runs ESLint                                         |
| `npm run format`  | Formats everything with Prettier                    |

## Deploying

`npm run build` produces a fully static site in `dist/`. It uses relative paths, so it can be hosted anywhere, including a GitHub Pages sub-path, Netlify or Cloudflare Pages.

## Layout

```
src/
  App.tsx              page layout and app state
  api/                 Open-Meteo and Nominatim clients
  hooks/               forecast loading, search-as-you-type, localStorage state
  lib/                 formatting, weather codes, sky themes, shareable URLs
  components/          UI components, each with its own CSS module
  styles/global.css    design tokens and shared styles
  test/                test setup and fixtures
```
