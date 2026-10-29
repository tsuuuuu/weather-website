import { weatherKind } from './weatherCodes'
import { minutesOfDay } from './format'

export type SkyTheme =
    | 'clear-day'
    | 'clear-night'
    | 'dawn'
    | 'dusk'
    | 'cloudy-day'
    | 'cloudy-night'
    | 'rain-day'
    | 'rain-night'
    | 'storm'
    | 'snow-day'
    | 'snow-night'
    | 'fog-day'
    | 'fog-night'

export type SkyEffect = 'none' | 'clouds' | 'drizzle' | 'rain' | 'snow' | 'fog' | 'storm'

export interface Sky {
    theme: SkyTheme
    effect: SkyEffect
    stars: boolean
}

// How close to sunrise/sunset (in minutes) a clear sky turns into dawn/dusk colors
const TWILIGHT_MINUTES = 45

interface SkyInput {
    weatherCode: number
    isDay: boolean
    // Local "YYYY-MM-DDTHH:mm" times; optional so the welcome screen can use a plain day/night sky
    time?: string
    sunrise?: string
    sunset?: string
}

export function pickSky({ weatherCode, isDay, time, sunrise, sunset }: SkyInput): Sky {
    const kind = weatherKind(weatherCode)
    const dayOrNight = isDay ? 'day' : 'night'

    switch (kind) {
        case 'storm':
            return { theme: 'storm', effect: 'storm', stars: false }
        case 'heavy-rain':
        case 'rain':
            return { theme: `rain-${dayOrNight}`, effect: 'rain', stars: false }
        case 'drizzle':
            return { theme: `rain-${dayOrNight}`, effect: 'drizzle', stars: false }
        case 'snow':
            return { theme: `snow-${dayOrNight}`, effect: 'snow', stars: false }
        case 'fog':
            return { theme: `fog-${dayOrNight}`, effect: 'fog', stars: false }
        case 'cloudy':
            return { theme: `cloudy-${dayOrNight}`, effect: 'clouds', stars: false }
    }

    // Clear or partly cloudy: the time of day decides the colors
    const effect: SkyEffect = kind === 'partly-cloudy' ? 'clouds' : 'none'
    if (time && sunrise && sunset) {
        const now = minutesOfDay(time)
        if (Math.abs(now - minutesOfDay(sunrise)) <= TWILIGHT_MINUTES) {
            return { theme: 'dawn', effect, stars: false }
        }
        if (Math.abs(now - minutesOfDay(sunset)) <= TWILIGHT_MINUTES) {
            return { theme: 'dusk', effect, stars: false }
        }
    }
    return isDay
        ? { theme: 'clear-day', effect, stars: false }
        : { theme: 'clear-night', effect, stars: true }
}
