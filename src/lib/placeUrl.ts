import type { Place } from '../types'

// Shareable links: ?name=Recife&region=Pernambuco&country=Brazil&lat=-8.05&lon=-34.88

export function placeFromUrl(search: string): Place | undefined {
    const params = new URLSearchParams(search)
    const latitude = Number.parseFloat(params.get('lat') ?? '')
    const longitude = Number.parseFloat(params.get('lon') ?? '')
    const name = params.get('name')?.trim()

    if (
        !name ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
    ) {
        return undefined
    }

    return {
        id: `${latitude.toFixed(3)},${longitude.toFixed(3)}`,
        name,
        region: params.get('region') || undefined,
        country: params.get('country') || undefined,
        latitude,
        longitude,
    }
}

export function placeToSearch(place: Place) {
    const params = new URLSearchParams({ name: place.name })
    if (place.region) params.set('region', place.region)
    if (place.country) params.set('country', place.country)
    params.set('lat', place.latitude.toFixed(4))
    params.set('lon', place.longitude.toFixed(4))
    return `?${params}`
}

// Two places are the same spot if their coordinates match to ~100 m
export const samePlace = (a: Place, b: Place) =>
    a.latitude.toFixed(3) === b.latitude.toFixed(3) &&
    a.longitude.toFixed(3) === b.longitude.toFixed(3)
