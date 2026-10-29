import type { RawForecast } from '../api/forecast'

const pad = (n: number) => String(n).padStart(2, '0')

// Campinas (UTC-3) at 14:15 local time on Thursday 29 October 2026, i.e. 17:15 UTC
export const FIXTURE_NOW = new Date('2026-10-29T17:15:00Z')

// Open-Meteo data with past_days=1: yesterday (28 Oct) plus 7 days from today
export function rawForecast(): RawForecast {
    const days = [
        '2026-10-28',
        '2026-10-29',
        '2026-10-30',
        '2026-10-31',
        '2026-11-01',
        '2026-11-02',
        '2026-11-03',
        '2026-11-04',
    ]
    const hours = days.flatMap((day) => Array.from({ length: 24 }, (_, h) => `${day}T${pad(h)}:00`))

    return {
        utc_offset_seconds: -3 * 3600,
        current: {
            time: '2026-10-29T14:15',
            temperature_2m: 24.6,
            apparent_temperature: 26.1,
            relative_humidity_2m: 58,
            precipitation: 0,
            weather_code: 2,
            is_day: 1,
            pressure_msl: 1013.4,
            wind_speed_10m: 12.3,
            wind_direction_10m: 225,
        },
        hourly_units: { visibility: 'm' },
        hourly: {
            time: hours,
            temperature_2m: hours.map((_, i) => 18 + 6 * Math.sin((i / 24) * 2 * Math.PI)),
            precipitation_probability: hours.map((_, i) => (i % 24 > 18 ? 40 : 0)),
            weather_code: hours.map((_, i) => (i % 24 > 18 ? 61 : 1)),
            is_day: hours.map((_, i) => (i % 24 >= 6 && i % 24 < 18 ? 1 : 0)),
            uv_index: hours.map((_, i) => (i === 24 + 14 ? 6.2 : 1)),
            visibility: hours.map(() => 24140),
        },
        daily: {
            time: days,
            weather_code: [3, 2, 61, 0, 3, 95, 71, 45],
            temperature_2m_max: [23, 27, 22, 29, 25, 21, 4, 18],
            temperature_2m_min: [15, 16, 15, 17, 16, 14, -2, 12],
            precipitation_probability_max: [0, 10, 80, 0, 20, 95, 60, 5],
            precipitation_sum: [0, 0, 8.4, 0, 0.2, 22.5, 3, 0],
            sunrise: days.map((day) => `${day}T05:48`),
            sunset: days.map((day) => `${day}T18:21`),
            uv_index_max: [5, 7.1, 3, 8, 5, 2, 1, 4],
            wind_speed_10m_max: [14, 18, 25, 12, 15, 40, 30, 10],
        },
    }
}

export const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
