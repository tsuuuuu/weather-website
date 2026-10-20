import { getJson } from '../lib/http.js'
import { describeWeather } from '../lib/weather-codes.js'
import { dayMonth, millimeters, percent, temperature, weekday } from '../lib/format.js'

const FORECAST_DAYS = 7

// Today's weather plus the next 7 days (Open-Meteo, no API key needed)
export const forecast = async (latitude, longitude) => {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.search = new URLSearchParams({
        latitude,
        longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: FORECAST_DAYS + 1,
    })

    const { current, daily } = await getJson(
        url,
        'Não foi possível conectar aos serviços meteorológicos!',
    )

    const days = daily.time.map((date, i) => ({
        date: dayMonth(date),
        weekday: weekday(date),
        icon: describeWeather(daily.weather_code[i]).icon,
        min: temperature(daily.temperature_2m_min[i]),
        max: temperature(daily.temperature_2m_max[i]),
    }))
    const [today, ...nextDays] = days
    const now = describeWeather(current.weather_code)

    return {
        today: {
            ...today,
            description: now.description,
            icon: now.icon,
            temperature: temperature(current.temperature_2m),
            feelsLike: temperature(current.apparent_temperature),
            humidity: percent(current.relative_humidity_2m),
            rainChance: percent(daily.precipitation_probability_max[0]),
            rainAmount: millimeters(daily.precipitation_sum[0]),
        },
        days: nextDays.slice(0, FORECAST_DAYS),
    }
}
