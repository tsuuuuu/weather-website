import type { Units } from '../types'

// Open-Meteo returns times local to the place ("YYYY-MM-DDTHH:mm"). Treating them as
// UTC and formatting in UTC keeps the viewer's own timezone out of the picture.
export const parseLocal = (value: string) => {
    const [date, time = '00:00'] = value.split('T')
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    return new Date(Date.UTC(year, month - 1, day, hours, minutes))
}

const pad = (n: number) => String(n).padStart(2, '0')

// The current time at a place, as "YYYY-MM-DDTHH:mm", from its UTC offset
export function localNow(utcOffsetSeconds: number, now = Date.now()) {
    const date = new Date(now + utcOffsetSeconds * 1000)
    return (
        `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
        `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
    )
}

// "2026-10-29T06:12" -> 372
export const minutesOfDay = (value: string) => {
    const date = parseLocal(value)
    return date.getUTCHours() * 60 + date.getUTCMinutes()
}

// "quinta-feira" -> "Quinta-feira", "qui." -> "Qui"
const tidy = (text: string) =>
    (text.charAt(0).toLocaleUpperCase() + text.slice(1)).replace(/\.$/, '')

// Date and number formatting for one locale ("en-US", "pt-BR", "es-ES"...)
export function createFormat(locale: string) {
    const dateFormat = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options })

    // "3 PM" where 12-hour clocks are the norm, "15:00" elsewhere
    const uses12Hours = dateFormat({ hour: 'numeric' }).resolvedOptions().hour12 === true
    const hourFormat = uses12Hours
        ? dateFormat({ hour: 'numeric' })
        : dateFormat({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    // "6:12 AM" / "06:12"
    const timeFormat = uses12Hours
        ? dateFormat({ hour: 'numeric', minute: '2-digit' })
        : dateFormat({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    const weekdayShortFormat = dateFormat({ weekday: 'short' })
    const weekdayFormat = dateFormat({ weekday: 'long' })
    const longDateFormat = dateFormat({ weekday: 'long', month: 'long', day: 'numeric' })

    const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
    const oneDecimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
    const twoDecimals = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    // + 0 turns -0 into 0
    const round = (value: number) => integer.format(Math.round(value) + 0)

    return {
        // "2026-10-29T15:00" -> "3 PM" / "15:00"
        hour: (value: string) => hourFormat.format(parseLocal(value)),
        // "2026-10-29T06:12" -> "6:12 AM" / "06:12"
        time: (value: string) => timeFormat.format(parseLocal(value)),
        // "2026-10-29" -> "Thu" / "Qui"
        weekdayShort: (value: string) => tidy(weekdayShortFormat.format(parseLocal(value))),
        // "2026-10-29" -> "Thursday" / "Quinta-feira"
        weekday: (value: string) => tidy(weekdayFormat.format(parseLocal(value))),
        // "2026-10-29T15:00" -> "Thursday, October 29" / "Quinta-feira, 29 de outubro"
        longDate: (value: string) => tidy(longDateFormat.format(parseLocal(value))),

        integer: round,
        temperature: (value: number) => `${round(value)}°`,
        percent: (value: number) => `${round(value)}%`,
        wind: (value: number, units: Units) =>
            `${round(value)} ${units === 'imperial' ? 'mph' : 'km/h'}`,
        precipitation: (value: number, units: Units) =>
            units === 'imperial'
                ? `${twoDecimals.format(value)} in`
                : `${oneDecimal.format(value)} mm`,
        visibility: (meters: number, units: Units) => {
            const value = units === 'imperial' ? meters / 1609.344 : meters / 1000
            const text = value >= 10 ? round(value) : oneDecimal.format(value)
            return `${text} ${units === 'imperial' ? 'mi' : 'km'}`
        },
    }
}

export type Format = ReturnType<typeof createFormat>

// 225 -> 5 (SW), an index into an 8-point compass
export const compassIndex = (degrees: number) =>
    Math.round((((degrees % 360) + 360) % 360) / 45) % 8

// 0 Low, 1 Moderate, 2 High, 3 Very high, 4 Extreme
export function uvLevel(uv: number) {
    if (uv < 3) return 0
    if (uv < 6) return 1
    if (uv < 8) return 2
    if (uv < 11) return 3
    return 4
}

// "São Paulo", "Brazil" -> "São Paulo, Brazil"
export const placeDetails = (place: { region?: string; country?: string }) =>
    [place.region, place.country].filter(Boolean).join(', ')
