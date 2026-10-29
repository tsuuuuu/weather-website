import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { STORAGE_KEYS } from './lib/storage'
import { FIXTURE_NOW, jsonResponse, rawForecast } from './test/fixtures'

const campinas = {
    id: 3467865,
    name: 'Campinas',
    latitude: -22.9,
    longitude: -47.06,
    admin1: 'São Paulo',
    country: 'Brazil',
}

let requests: URL[]

const setBrowserLanguages = (languages: string[]) =>
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)

beforeEach(() => {
    requests = []
    // Only Date is faked, so timers and user events still run normally
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(FIXTURE_NOW)
    window.localStorage.clear()
    window.history.replaceState(null, '', '/')
    setBrowserLanguages(['en-GB', 'en'])
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
        const url = new URL(String(input))
        requests.push(url)
        if (url.hostname === 'geocoding-api.open-meteo.com') {
            return jsonResponse({ results: [campinas] })
        }
        return jsonResponse(rawForecast())
    })
})

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

const searchAndPick = async (user: ReturnType<typeof userEvent.setup>, label: RegExp) => {
    await user.type(screen.getByRole('combobox', { name: label }), 'Campi')
    await user.click(await screen.findByRole('option', { name: /campinas/i }))
}

test('shows the welcome screen on a first visit', () => {
    render(<App />)
    const welcome = screen.getByRole('region', { name: /weather for anywhere/i })
    expect(within(welcome).getByRole('button', { name: /use my location/i })).toBeInTheDocument()
    expect(within(welcome).getByRole('button', { name: 'Tokyo' })).toBeInTheDocument()
})

test('searching for a city shows its forecast and a shareable link', async () => {
    const user = userEvent.setup()
    render(<App />)

    await searchAndPick(user, /search for a city/i)

    expect(await screen.findByRole('heading', { level: 1, name: 'Campinas' })).toBeInTheDocument()
    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument()
    expect(screen.getAllByText('Partly cloudy').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '7-day forecast' })).toBeInTheDocument()
    expect(window.location.search).toContain('name=Campinas')
    expect(document.title).toBe('Campinas · 25° | Hayashi Weather')
    expect(requests[0].searchParams.get('language')).toBe('en')
})

test('marks the current time in the hourly chart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await searchAndPick(user, /search for a city/i)

    const hourly = await screen.findByRole('region', { name: 'Hourly forecast' })
    const marker = within(hourly).getByTestId('now-marker')
    expect(marker).toHaveTextContent('Now')
    // 14:15 local time: column 12 (14:00) plus a quarter column
    expect(marker.querySelector('line')).toHaveAttribute('x1', String(12 * 56 + 28 + 14))
})

test('selecting a day shows its details and that day hourly, without the marker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await searchAndPick(user, /search for a city/i)

    const daily = await screen.findByRole('region', { name: '7-day forecast' })
    await user.click(within(daily).getByRole('button', { name: /fri/i }))

    const hourly = screen.getByRole('region', { name: 'Friday, hourly' })
    expect(within(hourly).queryByTestId('now-marker')).not.toBeInTheDocument()
    expect(within(daily).getByText('Light rain')).toBeInTheDocument()
})

test('favorites and units are remembered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await searchAndPick(user, /search for a city/i)

    await user.click(await screen.findByRole('button', { name: /add to favorites/i }))
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites)!)).toHaveLength(1)
    expect(screen.getByRole('navigation', { name: /saved places/i })).toHaveTextContent('Campinas')

    await user.click(screen.getByRole('button', { name: '°F' }))
    expect(requests.at(-1)?.searchParams.get('temperature_unit')).toBe('fahrenheit')
    expect(window.localStorage.getItem(STORAGE_KEYS.units)).toBe('"imperial"')
})

test('starts in Fahrenheit for US English', async () => {
    setBrowserLanguages(['en-US'])
    window.history.replaceState(null, '', '/?name=Recife&lat=-8.05&lon=-34.88')
    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Recife' })).toBeInTheDocument()
    expect(requests[0].searchParams.get('temperature_unit')).toBe('fahrenheit')
})

test('follows the browser language', async () => {
    setBrowserLanguages(['pt-BR', 'en'])
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'O tempo em qualquer lugar' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('pt-BR')

    await searchAndPick(user, /buscar uma cidade/i)
    expect(await screen.findByRole('heading', { level: 1, name: 'Campinas' })).toBeInTheDocument()
    expect(
        screen.getByText(/Quinta-feira, 29 de outubro · 14:15 no horário local/),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Parcialmente nublado').length).toBeGreaterThan(0)
    expect(screen.getByText('Agora')).toBeInTheDocument()
    expect(requests[0].searchParams.get('language')).toBe('pt')
})

test('the language picker overrides the browser and is remembered', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'es')

    expect(
        screen.getByRole('heading', { name: 'El tiempo en cualquier lugar' }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEYS.language)).toBe('"es"')
    expect(document.documentElement.lang).toBe('es-ES')
})

test('opens a shared link directly', async () => {
    window.history.replaceState(null, '', '/?name=Recife&country=Brazil&lat=-8.05&lon=-34.88')
    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Recife' })).toBeInTheDocument()
    expect(requests[0].searchParams.get('latitude')).toBe('-8.05')
})

test('shows a translated retry message when the forecast fails', async () => {
    setBrowserLanguages(['es-MX'])
    vi.mocked(globalThis.fetch).mockImplementation(async () => jsonResponse({ error: true }, 500))
    window.history.replaceState(null, '', '/?name=Recife&lat=-8.05&lon=-34.88')
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/no está disponible/i)
    vi.mocked(globalThis.fetch).mockImplementation(async () => jsonResponse(rawForecast()))
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Recife' })).toBeInTheDocument()
})
