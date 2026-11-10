# Hayashi Weather — Product

What the product is, who it's for, what it does today and where it could go next. For how to run and change the code, see [README.md](README.md) and [CLAUDE.md](CLAUDE.md).

## Vision

A fast, good-looking weather page that answers "what's the weather like there, now and this week?" at a glance, for any city, in the visitor's own language, with nothing to install, no sign-up and no ads.

It's also a personal portfolio project: it started in Andrew Mead's Node.js course on Udemy (v1, Express + Handlebars) and was rewritten as a static React app in v2.

## Who it's for

- **Casual visitors** checking today's weather and the week ahead for where they are or where they're going.
- **Portuguese, Spanish and English speakers**: the site follows the browser language, with a manual switch.
- **People looking at the author's work** (recruiters, peers), for whom polish, speed and code quality matter as much as the forecast.

## Principles

1. **Glanceable first.** Current temperature and conditions are readable in a second; details sit one step away (highlights, day details, hourly chart).
2. **Light and fast.** Static site, ~93 KB gzipped, no backend, no tracking, no ads. New features must justify their weight.
3. **Free and keyless.** Only free data sources that need no API key and can be called from the browser.
4. **Local by default.** Language, date and number formats and temperature units follow the visitor's browser. Times are always shown in the place's local time.
5. **Private.** Location is used only to fetch the forecast and is never stored on a server. Favorites and settings stay in the visitor's browser.
6. **Accessible and calm.** Works on phones and with keyboards and screen readers. Animations are subtle and turn off for people who prefer reduced motion.

## Current features (v2.0)

| Area       | What it does                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search     | City search with autocomplete showing region and country; "use my location"; suggested cities on first visit                                       |
| Now        | Temperature, conditions, high/low and feels-like, with an animated icon                                                                            |
| Highlights | Feels like, humidity, wind speed and direction, UV index, precipitation, pressure, visibility, sunrise and sunset                                  |
| Hourly     | Chart covering 12 hours back and 24 ahead, opening centered on a live "now" marker; past hours shaded                                              |
| 7 days     | Daily min/max range bars on a shared scale; selecting a day shows its details and its hourly chart                                                 |
| Sky        | Background that follows the real weather and local time: clear, dawn, dusk, starry night, clouds, rain, storm, snow, fog                           |
| Languages  | English, Portuguese and Spanish, detected from the browser with a manual picker; localized dates, 12/24-hour clock, number formats and place names |
| Personal   | Favorites, recent places, °C/°F (°F by default in the US), remembered between visits                                                               |
| Sharing    | The address bar always holds a shareable link to the place being viewed                                                                            |
| About      | About text, contact form (Formspree) and social links                                                                                              |

## Data sources and constraints

| Source                                    | Used for                               | Limits                                                                     |
| ----------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| [Open-Meteo](https://open-meteo.com/)     | Forecast and place search              | Free for non-commercial use; about 10,000 requests per day, per visitor IP |
| [Nominatim](https://nominatim.org/) (OSM) | Naming the place for "use my location" | At most 1 request per second; attribution to OpenStreetMap required        |
| [GitHub Pages](https://pages.github.com/) | Hosting                                | Free for public repos; ~100 GB traffic per month; not for commercial use   |

Because of these terms, the product stays **non-commercial**. Adding ads, paid tiers or selling the service would require switching to paid data and hosting plans.

## Non-goals

- Accounts, sign-in or syncing favorites across devices
- A backend, database or any API keys
- Ads, analytics or tracking
- Professional-grade forecasting (aviation, marine, agriculture) or official severe-weather warnings
- Native mobile apps (an installable web app is on the roadmap instead)

## Known limitations

- Saved and recent places keep the names they had when searched; switching language doesn't rename them.
- Once a language is picked manually, there's no way back to "follow the browser" except clearing site data.
- The contact form posts to a legacy Formspree address that hasn't been tested end to end.
- No offline support: without a connection the page shows an error.
- Place search matches place names, not full street addresses.

## Roadmap ideas

Ideas, not commitments, roughly in order of value for their size.

**Small**

- "Automatic" option in the language picker
- Re-localize saved places when the language changes
- Air quality (AQI, PM2.5) from Open-Meteo's free air-quality API
- "Warmer or cooler than usual" for today, from Open-Meteo's historical archive

**Medium**

- Installable web app (PWA) that shows the last forecast offline
- Precipitation chart in minutes ("rain starting in 20 minutes") where Open-Meteo has 15-minute data
- Custom domain for the live site

**Large**

- Rain radar map (for example RainViewer tiles with Leaflet), lazy-loaded so it doesn't slow the first visit
- Severe-weather alerts, which would need a different, region-specific data source

## Success signals

There is deliberately no analytics, so success is judged by hand:

- The page loads fast and stays light (bundle size is printed by `npm run build`)
- It looks right in all three languages, on phones and desktops, day and night
- Feedback from people the link is shared with, and through the contact form
