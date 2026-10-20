import { test } from 'node:test'
import assert from 'node:assert/strict'
import { forecast } from '../src/services/forecast.js'
import { geocode, reverseGeocode } from '../src/services/geocode.js'

const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })

const openMeteoBody = {
    current: {
        temperature_2m: 24.36,
        apparent_temperature: 25.1,
        relative_humidity_2m: 61,
        weather_code: 2,
    },
    daily: {
        time: Array.from({ length: 8 }, (_, i) => `2026-10-${20 + i}`),
        weather_code: [2, 0, 3, 61, 95, 45, 71, 80],
        temperature_2m_max: [28, 29, 27, 22, 21, 23, 1, 25],
        temperature_2m_min: [17, 18, 16, 15, 14, 15, -3, 16],
        precipitation_sum: [0, 0, 0.4, 12.3, 30, 0, 2, 5],
        precipitation_probability_max: [10, 0, 20, 90, 95, 5, 60, 70],
    },
}

test('forecast shapes today and the next 7 days', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => jsonResponse(openMeteoBody))

    const result = await forecast(-22.9, -47.06)

    const url = new URL(fetchMock.mock.calls[0].arguments[0])
    assert.equal(url.hostname, 'api.open-meteo.com')
    assert.equal(url.searchParams.get('latitude'), '-22.9')

    assert.deepEqual(result.today, {
        date: '20/10',
        weekday: 'Ter',
        icon: '/img/weather/cloudy-weather.gif',
        description: 'Parcialmente nublado',
        temperature: '24.4°C',
        feelsLike: '25.1°C',
        humidity: '61%',
        rainChance: '10%',
        rainAmount: '0mm',
        min: '17°C',
        max: '28°C',
    })
    assert.equal(result.days.length, 7)
    assert.deepEqual(result.days[0], {
        date: '21/10',
        weekday: 'Qua',
        icon: '/img/weather/sun-weather.gif',
        min: '18°C',
        max: '29°C',
    })
})

test('forecast reports an unavailable service', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => jsonResponse({ error: true }, 400))
    await assert.rejects(forecast(0, 0), { status: 502 })

    t.mock.method(globalThis, 'fetch', async () => {
        throw new TypeError('fetch failed')
    })
    await assert.rejects(forecast(0, 0), { status: 502 })
})

test('geocode returns coordinates and a readable name', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () =>
        jsonResponse({
            results: [
                {
                    name: 'Campinas',
                    admin1: 'São Paulo',
                    country: 'Brasil',
                    latitude: -22.9,
                    longitude: -47.06,
                },
            ],
        }),
    )

    assert.deepEqual(await geocode('Campinas, SP'), {
        latitude: -22.9,
        longitude: -47.06,
        location: 'Campinas, São Paulo, Brasil',
    })
    const url = new URL(fetchMock.mock.calls[0].arguments[0])
    assert.equal(url.searchParams.get('name'), 'Campinas')
})

test('geocode rejects unknown places with a 404', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => jsonResponse({ generationtime_ms: 0.1 }))
    await assert.rejects(geocode('Xyzzyville'), {
        status: 404,
        message: 'Local não encontrado, tente outra busca!',
    })
})

test('reverseGeocode returns "city - state"', async (t) => {
    t.mock.method(globalThis, 'fetch', async () =>
        jsonResponse({ address: { town: 'Valinhos', state: 'São Paulo' } }),
    )
    assert.equal(await reverseGeocode(-22.97, -46.99), 'Valinhos - São Paulo')
})
