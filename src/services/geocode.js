import { AppError, getJson } from '../lib/http.js'

const UNAVAILABLE = 'Não foi possível conectar ao serviço de localização!'

// Place name -> coordinates (Open-Meteo geocoding, no API key needed)
export const geocode = async (address) => {
    // The geocoding API only matches place names, so "Campinas, SP" becomes "Campinas"
    const name = address.split(',')[0].trim()
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.search = new URLSearchParams({ name, count: 1, language: 'pt', format: 'json' })

    const body = await getJson(url, UNAVAILABLE)
    const place = body.results?.[0]
    if (!place) {
        throw new AppError('Local não encontrado, tente outra busca!', 404)
    }

    return {
        latitude: place.latitude,
        longitude: place.longitude,
        location: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
    }
}

// Coordinates -> place name (OpenStreetMap Nominatim, no API key needed)
export const reverseGeocode = async (latitude, longitude) => {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.search = new URLSearchParams({
        lat: latitude,
        lon: longitude,
        format: 'jsonv2',
        zoom: 10,
        'accept-language': 'pt-BR',
    })

    const body = await getJson(url, UNAVAILABLE)
    const address = body.address
    if (!address) {
        throw new AppError('Local não encontrado!', 404)
    }

    const city = address.city ?? address.town ?? address.village ?? address.municipality
    return [city, address.state].filter(Boolean).join(' - ')
}
