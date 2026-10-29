import type { Language } from '../i18n/languages'
import type { Place } from '../types'
import { ApiError, getJson } from './http'

interface GeocodingResponse {
    results?: {
        id: number
        name: string
        latitude: number
        longitude: number
        admin1?: string
        country?: string
    }[]
}

// Place name -> matching places, named in the given language (Open-Meteo, no API key needed)
export async function searchPlaces(
    query: string,
    language: Language,
    signal?: AbortSignal,
): Promise<Place[]> {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.search = new URLSearchParams({
        name: query.trim(),
        count: '6',
        language,
        format: 'json',
    }).toString()

    const body = await getJson<GeocodingResponse>(url, 'searchUnavailable', signal)
    return (body.results ?? []).map((result) => ({
        id: String(result.id),
        name: result.name,
        region: result.admin1,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
    }))
}

interface NominatimResponse {
    address?: {
        city?: string
        town?: string
        village?: string
        municipality?: string
        county?: string
        state?: string
        country?: string
    }
}

// Coordinates -> place (OpenStreetMap Nominatim, no API key needed)
export async function reverseGeocode(
    latitude: number,
    longitude: number,
    locale: string,
    signal?: AbortSignal,
): Promise<Place> {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.search = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        format: 'jsonv2',
        zoom: '10',
        'accept-language': locale,
    }).toString()

    const { address } = await getJson<NominatimResponse>(url, 'searchUnavailable', signal)
    const name =
        address?.city ??
        address?.town ??
        address?.village ??
        address?.municipality ??
        address?.county
    if (!name) {
        throw new ApiError('noLocationName')
    }

    return {
        id: `${latitude.toFixed(3)},${longitude.toFixed(3)}`,
        name,
        region: address?.state,
        country: address?.country,
        latitude,
        longitude,
    }
}
