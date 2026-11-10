# Hayashi Weather

Static React + TypeScript weather app (Vite). There is no backend: the browser calls Open-Meteo (forecast, place search) and Nominatim (reverse geocoding) directly, and neither needs an API key. Live at https://tsuuuuu.github.io/weather-website/. See README.md for features and folder layout, and PRODUCT.md for the product's goals, principles, non-goals and roadmap. Check new features against PRODUCT.md's principles and non-goals.

## Commands

- `npm run dev` — dev server. On Windows Vite listens only on IPv6 `::1`; use `npm run dev -- --host 127.0.0.1` if a browser can't reach `localhost`.
- `npm test` — Vitest, no network (fetch is mocked)
- `npm run lint` — ESLint
- `npm run format:check` / `npm run format` — Prettier
- `npm run build` — type-checks, then builds the static site into `dist/`

Run test, lint, format check and build before committing.

## Rules for changes

- **Keep it static.** No server, no API keys, no secrets. New data sources must be free, keyless and callable from the browser (CORS).
- **Every user-facing string goes in all three translation files**: `src/i18n/en.tsx`, `pt.tsx`, `es.tsx`. `Messages` is typed from `en.tsx`, so a key missing in `pt`/`es` fails the build. Weather-code labels live there too.
- **Dates and numbers go through `format` from `useI18n()`** (built by `createFormat(locale)` in `src/lib/format.ts`), never hard-coded `toFixed` or `en-US`.
- **API times are local to the place** (`"YYYY-MM-DDTHH:mm"`). Parse them with `parseLocal` and format in UTC so the viewer's timezone never shifts them. For the place's current time use `localNow(forecast.utcOffsetSeconds)`.
- The forecast request uses `past_days=1`: `hourly` starts yesterday at 00:00, while `daily` is trimmed to start today. Find hours by date (`hoursForDay`), not by `dayIndex * 24`.
- **API errors are codes, not text.** `ApiError.code` maps to `t.errors[code]` in the UI.
- **Styling:** one CSS module per component; design tokens and the shared `.card` / `.card-title` classes are in `src/styles/global.css`. `body` must stay without a background, or it covers the fixed sky layer (`SkyBackground`, z-index -1).
- **Icons are hand-made inline SVGs** (`Icons.tsx`, `WeatherIcon.tsx`). Don't add icon fonts, image icons or UI libraries; the whole site is ~93 KB gzipped and should stay light.
- Animations must respect `prefers-reduced-motion` (handled globally in `global.css`).
- localStorage access goes through `readStored` / `writeStored` / `useStoredState` (they tolerate blocked storage). Keys are in `STORAGE_KEYS`.

## Testing

See TESTING.md for the full guide: what each test file covers, how mocks are set up, conventions for new tests and what still needs manual checks.

- Shared fixtures are in `src/test/fixtures.ts`: Campinas (UTC-3) at 14:15 local time on 29 Oct 2026, with yesterday included as with `past_days=1`.
- App tests fake only `Date` (`vi.useFakeTimers({ toFake: ['Date'] })`) so user events still work, and set `navigator.languages` to choose the language.
- Vitest globals are off: import `describe`/`test`/`expect`/`vi` explicitly.

## Workflow

- Work on a branch and open a PR into `master`. Merging to `master` deploys to GitHub Pages through `.github/workflows/deploy.yml`, which runs the tests first.
- `vite.config.ts` uses `base: './'` so the build works from the `/weather-website/` sub-path. Keep asset paths relative (`./favicon.svg`).
- Line endings are LF everywhere (`.gitattributes`); Prettier fails on CRLF.
