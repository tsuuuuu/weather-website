import { describe, expect, test } from 'vitest'
import { normalizeForecast } from '../api/forecast'
import { hoursForDay, timePosition } from '../components/HourlyChart'
import { defaultUnitsFor, detectLanguage, localeFor } from '../i18n/languages'
import { rawForecast } from '../test/fixtures'
import { compassIndex, createFormat, localNow, placeDetails, uvLevel } from './format'
import { placeFromUrl, placeToSearch, samePlace } from './placeUrl'
import { pickSky } from './sky'
import { weatherKind, weatherLabel } from './weatherCodes'
import { en } from '../i18n/en'
import { pt } from '../i18n/pt'

describe('format', () => {
    const english = createFormat('en-US')
    const portuguese = createFormat('pt-BR')
    const spanish = createFormat('es-ES')

    test('formats local times without the viewer timezone shifting them', () => {
        expect(english.hour('2026-10-29T15:00')).toBe('3 PM')
        expect(english.time('2026-10-29T06:05')).toBe('6:05 AM')
        expect(english.weekdayShort('2026-10-29')).toBe('Thu')
        expect(english.longDate('2026-11-01T09:00')).toBe('Sunday, November 1')
    })

    test('uses 24-hour clocks and capitalized names in Portuguese and Spanish', () => {
        expect(portuguese.hour('2026-10-29T15:00')).toBe('15:00')
        expect(portuguese.time('2026-10-29T06:05')).toBe('06:05')
        expect(portuguese.weekdayShort('2026-10-29')).toBe('Qui')
        expect(portuguese.longDate('2026-10-29T09:00')).toBe('Quinta-feira, 29 de outubro')
        expect(spanish.weekday('2026-10-29')).toBe('Jueves')
        expect(spanish.longDate('2026-10-29T09:00')).toBe('Jueves, 29 de octubre')
    })

    test('formats numbers with the locale separators', () => {
        expect(english.temperature(24.6)).toBe('25°')
        expect(english.temperature(-0.4)).toBe('0°')
        expect(english.wind(12.3, 'metric')).toBe('12 km/h')
        expect(english.precipitation(8.44, 'metric')).toBe('8.4 mm')
        expect(portuguese.precipitation(8.44, 'metric')).toBe('8,4 mm')
        expect(english.precipitation(0.123, 'imperial')).toBe('0.12 in')
        expect(english.visibility(24140, 'imperial')).toBe('15 mi')
        expect(portuguese.visibility(800, 'metric')).toBe('0,8 km')
        expect(english.integer(1013.4)).toBe('1,013')
        expect(portuguese.integer(1013.4)).toBe('1.013')
    })

    test('finds the local time at a place from its UTC offset', () => {
        expect(localNow(-3 * 3600, Date.UTC(2026, 9, 29, 17, 15))).toBe('2026-10-29T14:15')
        expect(localNow(9 * 3600, Date.UTC(2026, 9, 29, 17, 15))).toBe('2026-10-30T02:15')
    })

    test('maps wind direction and UV index to levels', () => {
        expect(compassIndex(0)).toBe(0)
        expect(compassIndex(225)).toBe(5)
        expect(compassIndex(350)).toBe(0)
        expect(compassIndex(-90)).toBe(6)
        expect(uvLevel(2)).toBe(0)
        expect(uvLevel(6.2)).toBe(2)
        expect(uvLevel(11)).toBe(4)
    })

    test('joins place details', () => {
        expect(placeDetails({ region: 'São Paulo', country: 'Brazil' })).toBe('São Paulo, Brazil')
        expect(placeDetails({ country: 'Japan' })).toBe('Japan')
    })
})

describe('languages', () => {
    test('picks the first supported browser language', () => {
        expect(detectLanguage(['pt-BR', 'en-US'])).toBe('pt')
        expect(detectLanguage(['de-DE', 'es-MX', 'en'])).toBe('es')
        expect(detectLanguage(['de-DE', 'fr'])).toBe('en')
        expect(detectLanguage([])).toBe('en')
    })

    test('keeps the browser region for dates and numbers', () => {
        expect(localeFor('es', ['de-DE', 'es-MX'])).toBe('es-MX')
        expect(localeFor('pt', ['en-US'])).toBe('pt-BR')
        expect(localeFor('en', ['en-GB'])).toBe('en-GB')
    })

    test('defaults to Fahrenheit only where it is used', () => {
        expect(defaultUnitsFor('en-US')).toBe('imperial')
        expect(defaultUnitsFor('en-GB')).toBe('metric')
        expect(defaultUnitsFor('pt-BR')).toBe('metric')
        expect(defaultUnitsFor('es')).toBe('metric')
    })
})

describe('weather codes', () => {
    test('maps WMO codes to a kind and a translated label', () => {
        expect(weatherKind(0)).toBe('clear')
        expect(weatherKind(82)).toBe('heavy-rain')
        expect(weatherKind(1234)).toBe('cloudy')
        expect(weatherLabel(en, 61)).toBe('Light rain')
        expect(weatherLabel(pt, 61)).toBe('Chuva fraca')
        expect(weatherLabel(pt, 1234)).toBe('Desconhecido')
    })

    test('every language translates every code', () => {
        for (const code of Object.keys(en.weather)) {
            expect(pt.weather[Number(code)]).toBeTruthy()
        }
    })
})

describe('sky', () => {
    const times = { sunrise: '2026-10-29T05:48', sunset: '2026-10-29T18:21' }

    test('clear skies follow the time of day', () => {
        expect(
            pickSky({ weatherCode: 0, isDay: true, time: '2026-10-29T12:00', ...times }).theme,
        ).toBe('clear-day')
        expect(
            pickSky({ weatherCode: 0, isDay: true, time: '2026-10-29T06:10', ...times }).theme,
        ).toBe('dawn')
        expect(
            pickSky({ weatherCode: 1, isDay: false, time: '2026-10-29T18:50', ...times }).theme,
        ).toBe('dusk')
        expect(
            pickSky({ weatherCode: 0, isDay: false, time: '2026-10-29T23:00', ...times }),
        ).toEqual({ theme: 'clear-night', effect: 'none', stars: true })
    })

    test('weather overrides the time of day', () => {
        expect(pickSky({ weatherCode: 63, isDay: true })).toMatchObject({
            theme: 'rain-day',
            effect: 'rain',
        })
        expect(pickSky({ weatherCode: 51, isDay: false })).toMatchObject({
            theme: 'rain-night',
            effect: 'drizzle',
        })
        expect(pickSky({ weatherCode: 95, isDay: true })).toMatchObject({
            theme: 'storm',
            effect: 'storm',
        })
        expect(pickSky({ weatherCode: 73, isDay: false }).theme).toBe('snow-night')
        expect(pickSky({ weatherCode: 45, isDay: true }).effect).toBe('fog')
        expect(pickSky({ weatherCode: 2, isDay: true }).effect).toBe('clouds')
    })
})

describe('hourly chart window', () => {
    const forecast = normalizeForecast(rawForecast(), 'metric')

    test('today shows 12 hours before and 24 hours after now', () => {
        const hours = hoursForDay(forecast, 0)
        expect(hours).toHaveLength(37)
        expect(hours[0].time).toBe('2026-10-29T02:00')
        expect(hours[12].time).toBe('2026-10-29T14:00')
        expect(hours.at(-1)!.time).toBe('2026-10-30T14:00')
    })

    test('other days show that day from midnight', () => {
        const hours = hoursForDay(forecast, 1)
        expect(hours).toHaveLength(24)
        expect(hours[0].time).toBe('2026-10-30T00:00')
    })

    test('places the now marker by hour and minute', () => {
        const hours = hoursForDay(forecast, 0)
        // Column 12 (14:00) is centered at 12 * 56 + 28; 15 minutes adds a quarter column
        expect(timePosition(hours, '2026-10-29T14:15')).toBe(12 * 56 + 28 + 14)
        expect(timePosition(hoursForDay(forecast, 1), '2026-10-29T14:15')).toBeUndefined()
    })
})

describe('place URLs', () => {
    const recife = {
        id: '-8.054,-34.881',
        name: 'Recife',
        region: 'Pernambuco',
        country: 'Brazil',
        latitude: -8.05389,
        longitude: -34.88111,
    }

    test('round-trips a place through the query string', () => {
        const search = placeToSearch(recife)
        expect(search).toBe(
            '?name=Recife&region=Pernambuco&country=Brazil&lat=-8.0539&lon=-34.8811',
        )
        expect(placeFromUrl(search)).toMatchObject({
            name: 'Recife',
            region: 'Pernambuco',
            latitude: -8.0539,
        })
    })

    test('ignores incomplete or invalid links', () => {
        expect(placeFromUrl('')).toBeUndefined()
        expect(placeFromUrl('?name=Recife&lat=abc&lon=1')).toBeUndefined()
        expect(placeFromUrl('?name=X&lat=95&lon=1')).toBeUndefined()
        expect(placeFromUrl('?lat=1&lon=1')).toBeUndefined()
    })

    test('treats nearby coordinates as the same place', () => {
        expect(samePlace(recife, { ...recife, latitude: -8.0541 })).toBe(true)
        expect(samePlace(recife, { ...recife, latitude: -8.06 })).toBe(false)
    })
})
