# Testing

How the tests work, what they cover and what still has to be checked by hand. For the project overview see [README.md](README.md).

## Running the tests

```bash
npm test                                  # run everything once
npm run test:watch                        # re-run on every change
npx vitest run src/lib/lib.test.ts        # one file
npx vitest run -t "now marker"            # tests whose name matches
```

The tests never touch the network, so they run offline and give the same result on any day, in any timezone.

Before committing, also run `npm run lint`, `npm run format:check` and `npm run build` (the build type-checks the tests too).

## Stack

- [Vitest](https://vitest.dev/) 4, configured in `vite.config.ts` under `test`
- [jsdom](https://github.com/jsdom/jsdom) as the browser environment
- [Testing Library](https://testing-library.com/) (`@testing-library/react`, `user-event`) to render components and act like a user
- [jest-dom](https://github.com/testing-library/jest-dom) matchers such as `toBeInTheDocument` and `toHaveTextContent`

**Vitest globals are off.** Import `describe`, `test`, `expect` and `vi` from `vitest` in every test file. Because of that, `src/test/setup.ts` registers Testing Library's `cleanup` after each test itself, otherwise rendered pages would pile up between tests.

## Layout

Tests sit next to the code they cover:

| File                   | Tests | Covers                                                                           |
| ---------------------- | ----: | -------------------------------------------------------------------------------- |
| `src/lib/lib.test.ts`  |    19 | Pure logic: formatting, languages, weather codes, sky themes, chart window, URLs |
| `src/api/api.test.ts`  |     8 | Open-Meteo and Nominatim clients: requests, response mapping, errors             |
| `src/App.test.tsx`     |    10 | The whole app rendered in jsdom, driven like a user                              |
| `src/test/setup.ts`    |       | jest-dom matchers and cleanup                                                    |
| `src/test/fixtures.ts` |       | Shared fake API data                                                             |

## Test data

`src/test/fixtures.ts` provides:

- **`rawForecast()`**: a full Open-Meteo response for **Campinas (UTC-3) at 14:15 local time on Thursday 29 October 2026**. Like the real request (`past_days=1`), it starts yesterday: 8 days of hourly data from 28 October 00:00, and 8 daily entries of which the app keeps the 7 from today. Each call returns a fresh copy, so a test can change it safely.
- **`FIXTURE_NOW`**: the matching instant, `2026-10-29T17:15:00Z`.
- **`jsonResponse(body, status)`**: builds a `Response` for mocked `fetch` calls.

Useful facts when writing assertions: the current hour is index 38 in `hourly` (24 + 14), "now" is column 12 of today's chart, Friday 30 October has light rain (code 61), and the current conditions are partly cloudy at 24.6 °C (shown as 25°).

## How the tests isolate the app

| What             | How                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Network          | `vi.spyOn(globalThis, 'fetch')` returns fixtures; each test can see the URLs that were requested                                        |
| Current time     | `vi.useFakeTimers({ toFake: ['Date'] })` + `vi.setSystemTime(FIXTURE_NOW)`. Only `Date` is faked, so timers and `user-event` still work |
| Browser language | `vi.spyOn(navigator, 'languages', 'get')`; App tests default to `['en-GB', 'en']` (English, °C)                                         |
| Saved settings   | `localStorage.clear()` before each test                                                                                                 |
| Address bar      | `history.replaceState` resets the URL, or sets a shared link like `?name=Recife&lat=…&lon=…`                                            |

Every mock is undone in `afterEach` with `vi.useRealTimers()` and `vi.restoreAllMocks()`.

## What's covered

**Formatting and languages** (`lib.test.ts`)

- Local API times are formatted without the viewer's timezone shifting them
- English uses 12-hour times ("3 PM"); Portuguese and Spanish use 24-hour times ("15:00") and capitalized day names ("Quinta-feira")
- Decimal and thousands separators follow the locale ("8,4 mm", "1.013")
- The place's current time is computed from its UTC offset
- Browser language detection, keeping the browser's region (`es-MX`), and °F by default for the US but °C for the UK, Brazil and Spain
- Every weather code has a label in all three languages

**Weather and sky** (`lib.test.ts`)

- Clear skies switch between day, dawn, dusk and night around sunrise and sunset
- Rain, drizzle, storm, snow, fog and clouds override the time of day

**Hourly chart** (`lib.test.ts` and `App.test.tsx`)

- Today shows 12 hours back and 24 ahead; other days show midnight to midnight
- The "now" marker is placed by hour and minute, appears only on today, and shows in the visitor's language

**Shareable links** (`lib.test.ts`)

- A place survives the round trip through the URL; broken or out-of-range links are ignored
- Coordinates within about 100 m count as the same place (for favorites and recents)

**API clients** (`api.test.ts`)

- The forecast request asks for the right variables, units, timezone and `past_days=1`
- Responses are mapped to the app's types: current hour found, yesterday dropped from the daily list, visibility in feet converted to meters
- Network failures and HTTP errors become `ApiError` codes
- Place search maps results and passes the language; reverse geocoding picks the most specific name and fails cleanly without an address

**The app as a user sees it** (`App.test.tsx`)

- First visit shows the welcome screen with suggestions
- Searching shows the forecast, updates the shareable URL and page title, and searches in the visitor's language
- Selecting a day shows its details and its hourly chart
- Favorites and °C/°F are remembered; US English starts in °F
- The page follows the browser language, and the language picker overrides it and is remembered
- Shared links open their place directly
- A failed forecast shows a translated message, and "try again" recovers

## Writing new tests

- **Query like a user**: `getByRole('button', { name: … })`, `getByRole('region', { name: … })`. The sections are labelled by their headings, so they can be found by title. Use `data-testid` only for parts with no accessible name (the now marker uses `now-marker`).
- **Use the translated text** for the language under test, and set the language explicitly when it matters.
- **Pure logic goes in `lib.test.ts`** (or a new `*.test.ts` next to the module). Only test through `<App />` when the behavior spans components.
- **New user-facing strings**: TypeScript already fails the build if a key is missing from `pt.tsx` or `es.tsx`. If you add codes to `weather`, the completeness test covers them.
- **New API fields**: add them to `rawForecast()` with realistic values, and assert the mapping in `api.test.ts`.
- Keep tests offline and deterministic: never call real APIs, and never depend on today's date or the machine's timezone.

## Automated runs

The GitHub Pages workflow (`.github/workflows/deploy.yml`) runs `npm test` before every deploy. If a test fails, nothing is published. There is no separate CI on pull requests, so run the tests locally before opening one.

## Not covered by automated tests

These need a manual check, ideally in a real browser at desktop and phone widths:

- **Look and feel**: layout, the animated sky for each weather type, icons and the hourly chart drawing. There are no visual or screenshot tests.
- **Real APIs**: the tests use fixtures, so a change in Open-Meteo or Nominatim responses wouldn't be caught. Try a real search after upgrading anything that touches `src/api`.
- **"Use my location"**: the browser permission prompt and real geolocation.
- **Contact form**: posting to Formspree.
- **Other browsers**: tests run in jsdom only, not in real Chrome, Firefox or Safari.
- **Code coverage**: not measured; there's no coverage tool installed.

A quick manual pass: run `npm run dev -- --host 127.0.0.1`, search a city in each language, open another day, toggle °C/°F, favorite a place, reload, and check a phone-width window.
