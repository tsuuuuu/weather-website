import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'
import { AppError } from '../src/lib/http.js'

const weather = { today: { date: '20/10' }, days: [] }

const services = {
    geocode: async (address) => {
        if (address === 'nowhere') {
            throw new AppError('Local não encontrado, tente outra busca!', 404)
        }
        return { latitude: 1, longitude: 2, location: 'Campinas, São Paulo, Brasil' }
    },
    reverseGeocode: async (latitude) => {
        if (latitude === 0) {
            throw new AppError('Local não encontrado!', 404)
        }
        return 'Campinas - São Paulo'
    },
    forecast: async () => weather,
}

let server
let baseUrl

before(async () => {
    server = createApp(services).listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${server.address().port}`
})

after(() => server.close())

const get = (path) => fetch(baseUrl + path)

test('renders the pages', async () => {
    for (const [path, title] of [
        ['/', 'Previsão do tempo'],
        ['/about', 'Sobre esta página'],
        ['/contact', 'Contato'],
    ]) {
        const response = await get(path)
        assert.equal(response.status, 200, path)
        const html = await response.text()
        assert.match(html, new RegExp(`<h1>${title}</h1>`), path)
        assert.match(html, /Created by Tsuyoshi/, path)
    }
})

test('unknown pages return a 404 page', async () => {
    const response = await get('/does/not/exist')
    assert.equal(response.status, 404)
    assert.match(await response.text(), /Página não encontrada/)
})

test('serves Font Awesome from node_modules', async () => {
    const response = await get('/vendor/fontawesome/css/all.min.css')
    assert.equal(response.status, 200)
})

test('GET /weather by address', async () => {
    const response = await get('/weather?address=Campinas')
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { location: 'Campinas, São Paulo, Brasil', ...weather })
})

test('GET /weather by coordinates', async () => {
    const response = await get('/weather?lat=-22.9&lon=-47.06')
    assert.deepEqual(await response.json(), { location: 'Campinas - São Paulo', ...weather })
})

test('GET /weather falls back to coordinates when reverse geocoding fails', async () => {
    const response = await get('/weather?lat=0&lon=10')
    assert.equal((await response.json()).location, '0.0000, 10.0000')
})

test('GET /weather errors are JSON with a status code', async () => {
    for (const [path, status] of [
        ['/weather', 400],
        ['/weather?address=%20', 400],
        ['/weather?lat=abc&lon=1', 400],
        ['/weather?lat=91&lon=1', 400],
        ['/weather?address=nowhere', 404],
    ]) {
        const response = await get(path)
        assert.equal(response.status, status, path)
        assert.ok((await response.json()).error, path)
    }
})
