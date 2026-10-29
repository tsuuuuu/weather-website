import type { Forecast, Units } from '../types'
import { getJson } from './http'

export interface RawForecast {
    utc_offset_seconds: number
    current: {
        time: string
        temperature_2m: number
        apparent_temperature: number
        relative_humidity_2m: number
        precipitation: number
        weather_code: number
        is_day: number
        pressure_msl: number
        wind_speed_10m: number
        wind_direction_10m: number
    }
    hourly_units: { visibility: string }
    hourly: {
        time: string[]
        temperature_2m: number[]
        precipitation_probability: (number | null)[]
        weather_code: number[]
        is_day: number[]
        uv_index: (number | null)[]
        visibility: (number | null)[]
    }
    daily: {
        time: string[]
        weather_code: number[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        precipitation_probability_max: (number | null)[]
        precipitation_sum: (number | null)[]
        sunrise: string[]
        sunset: string[]
        uv_index_max: (number | null)[]
        wind_speed_10m_max: number[]
    }
}

const FEET_TO_METERS = 0.3048

// Current conditions, hourly and 7-day forecast from Open-Meteo (no API key needed)
export async function fetchForecast(
    latitude: number,
    longitude: number,
    units: Units,
    signal?: AbortSignal,
): Promise<Forecast> {
    const imperial = units === 'imperial'
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: [
            'temperature_2m',
            'apparent_temperature',
            'relative_humidity_2m',
            'precipitation',
            'weather_code',
            'is_day',
            'pressure_msl',
            'wind_speed_10m',
            'wind_direction_10m',
        ].join(','),
        hourly: 'temperature_2m,precipitation_probability,weather_code,is_day,uv_index,visibility',
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_probability_max',
            'precipitation_sum',
            'sunrise',
            'sunset',
            'uv_index_max',
            'wind_speed_10m_max',
        ].join(','),
        timezone: 'auto',
        // Yesterday is included so the hourly chart can show the hours before now
        past_days: '1',
        forecast_days: '7',
        temperature_unit: imperial ? 'fahrenheit' : 'celsius',
        wind_speed_unit: imperial ? 'mph' : 'kmh',
        precipitation_unit: imperial ? 'inch' : 'mm',
    }).toString()

    const raw = await getJson<RawForecast>(url, 'forecastUnavailable', signal)
    return normalizeForecast(raw, units)
}

export function normalizeForecast(raw: RawForecast, units: Units): Forecast {
    const { current, hourly, daily } = raw

    // current.time is rounded to 15 minutes; hourly times are on the hour
    const currentHour = current.time.slice(0, 13)
    const nowIndex = Math.max(
        0,
        hourly.time.findIndex((time) => time.slice(0, 13) === currentHour),
    )
    const visibilityFactor = raw.hourly_units.visibility === 'ft' ? FEET_TO_METERS : 1

    // The daily list starts today; yesterday (from past_days) is only needed hourly
    const today = current.time.slice(0, 10)
    const firstDay = Math.max(0, daily.time.indexOf(today))

    return {
        units,
        utcOffsetSeconds: raw.utc_offset_seconds,
        current: {
            time: current.time,
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            precipitation: current.precipitation,
            weatherCode: current.weather_code,
            isDay: current.is_day === 1,
            pressure: current.pressure_msl,
            windSpeed: current.wind_speed_10m,
            windDirection: current.wind_direction_10m,
            uvIndex: hourly.uv_index[nowIndex] ?? 0,
            visibilityMeters: (hourly.visibility[nowIndex] ?? 0) * visibilityFactor,
        },
        hourly: hourly.time.map((time, i) => ({
            time,
            temperature: hourly.temperature_2m[i],
            precipitationChance: hourly.precipitation_probability[i] ?? 0,
            weatherCode: hourly.weather_code[i],
            isDay: hourly.is_day[i] === 1,
        })),
        nowIndex,
        daily: daily.time.slice(firstDay).map((date, offset) => {
            const i = firstDay + offset
            return {
                date,
                weatherCode: daily.weather_code[i],
                max: daily.temperature_2m_max[i],
                min: daily.temperature_2m_min[i],
                precipitationChance: daily.precipitation_probability_max[i] ?? 0,
                precipitationSum: daily.precipitation_sum[i] ?? 0,
                sunrise: daily.sunrise[i],
                sunset: daily.sunset[i],
                uvIndexMax: daily.uv_index_max[i] ?? 0,
                windSpeedMax: daily.wind_speed_10m_max[i],
            }
        }),
    }
}
