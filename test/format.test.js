import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dayMonth, millimeters, percent, temperature, weekday } from '../src/lib/format.js'
import { describeWeather } from '../src/lib/weather-codes.js'

test('formats values for display', () => {
    assert.equal(temperature(23.456), '23.5°C')
    assert.equal(temperature(-0.04), '0°C')
    assert.equal(percent(39.6), '40%')
    assert.equal(percent(null), '0%')
    assert.equal(millimeters(1.25), '1.3mm')
    assert.equal(millimeters(undefined), '0mm')
})

test('formats dates without depending on the server timezone', () => {
    assert.equal(dayMonth('2026-10-20'), '20/10')
    assert.equal(weekday('2026-10-20'), 'Ter')
    assert.equal(weekday('2026-10-25'), 'Dom')
})

test('maps WMO weather codes to a description and icon', () => {
    assert.deepEqual(describeWeather(0), {
        description: 'Céu limpo',
        icon: '/img/weather/sun-weather.gif',
    })
    assert.equal(describeWeather(95).icon, '/img/weather/stormy-weather.gif')
    assert.equal(describeWeather(1234).description, 'Indisponível')
})
