import { afterEach, describe, expect, test, vi } from 'vitest'
import { jsonResponse, rawForecast } from '../test/fixtures'
import { fetchForecast, normalizeForecast } from './forecast'
import { ApiError } from './http'
import { reverseGeocode, searchPlaces } from './places'

const mockFetch = (implementation: (url: URL) => Response | Promise<Response>) =>
    vi
        .spyOn(globalThis, 'fetch')
        .mockImplementation(async (input) => implementation(new URL(String(input))))

afterEach(() => {
    vi.restoreAllMocks()
})

describe('forecast', () => {
    test('requests the right variables and units', async () => {
        const fetchSpy = mockFetch(() => jsonResponse(rawForecast()))

        await fetchForecast(-22.9, -47.06, 'imperial')

        const url = new URL(String(fetchSpy.mock.calls[0][0]))
        expect(url.hostname).toBe('api.open-meteo.com')
        expect(url.searchParams.get('latitude')).toBe('-22.9')
        expect(url.searchParams.get('temperature_unit')).toBe('fahrenheit')
        expect(url.searchParams.get('wind_speed_unit')).toBe('mph')
        expect(url.searchParams.get('timezone')).toBe('auto')
        expect(url.searchParams.get('past_days')).toBe('1')
    })

    test('normalizes the response and finds the current hour', () => {
        const forecast = normalizeForecast(rawForecast(), 'metric')

        expect(forecast.nowIndex).toBe(24 + 14)
        expect(forecast.current).toMatchObject({
            temperature: 24.6,
            isDay: true,
            uvIndex: 6.2,
            visibilityMeters: 24140,
        })
        expect(forecast.hourly).toHaveLength(8 * 24)
        // Yesterday is dropped from the daily list
        expect(forecast.daily).toHaveLength(7)
        expect(forecast.daily[0].date).toBe('2026-10-29')
        expect(forecast.utcOffsetSeconds).toBe(-10800)
        expect(forecast.daily[1]).toMatchObject({ date: '2026-10-30', weatherCode: 61, max: 22 })
    })

    test('converts visibility reported in feet', () => {
        const raw = rawForecast()
        raw.hourly_units.visibility = 'ft'
        raw.hourly.visibility = raw.hourly.visibility.map(() => 1000)
        expect(normalizeForecast(raw, 'imperial').current.visibilityMeters).toBeCloseTo(304.8)
    })

    test('turns network and HTTP failures into a friendly ApiError', async () => {
        mockFetch(() => jsonResponse({ error: true, reason: 'bad' }, 400))
        await expect(fetchForecast(0, 0, 'metric')).rejects.toBeInstanceOf(ApiError)

        mockFetch(() => {
            throw new TypeError('Failed to fetch')
        })
        await expect(fetchForecast(0, 0, 'metric')).rejects.toMatchObject({
            code: 'forecastUnavailable',
        })
    })
})

describe('places', () => {
    test('searchPlaces maps geocoding results', async () => {
        const fetchSpy = mockFetch(() =>
            jsonResponse({
                results: [
                    {
                        id: 3467865,
                        name: 'Campinas',
                        latitude: -22.9,
                        longitude: -47.06,
                        admin1: 'São Paulo',
                        country: 'Brazil',
                    },
                ],
            }),
        )

        expect(await searchPlaces(' Campinas ', 'pt')).toEqual([
            {
                id: '3467865',
                name: 'Campinas',
                region: 'São Paulo',
                country: 'Brazil',
                latitude: -22.9,
                longitude: -47.06,
            },
        ])
        expect(new URL(String(fetchSpy.mock.calls[0][0])).searchParams.get('name')).toBe('Campinas')
        expect(new URL(String(fetchSpy.mock.calls[0][0])).searchParams.get('language')).toBe('pt')
    })

    test('searchPlaces returns an empty list when nothing matches', async () => {
        mockFetch(() => jsonResponse({ generationtime_ms: 0.2 }))
        expect(await searchPlaces('Xyzzy', 'en')).toEqual([])
    })

    test('reverseGeocode picks the most specific name', async () => {
        mockFetch(() =>
            jsonResponse({ address: { town: 'Valinhos', state: 'São Paulo', country: 'Brazil' } }),
        )
        expect(await reverseGeocode(-22.97, -46.99, 'pt-BR')).toMatchObject({
            name: 'Valinhos',
            region: 'São Paulo',
            country: 'Brazil',
        })
    })

    test('reverseGeocode fails when there is no address', async () => {
        mockFetch(() => jsonResponse({ error: 'Unable to geocode' }))
        await expect(reverseGeocode(0, 0, 'en-US')).rejects.toMatchObject({
            code: 'noLocationName',
        })
    })
})
