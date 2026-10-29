// localStorage can be missing or throw (private mode, blocked storage), so every
// access falls back to the default value
export function readStored<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key)
        return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
        return fallback
    }
}

export function writeStored(key: string, value: unknown) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // Storage is a convenience; the app works without it
    }
}

export const STORAGE_KEYS = {
    favorites: 'hayashi-weather:favorites',
    recents: 'hayashi-weather:recents',
    units: 'hayashi-weather:units',
    lastPlace: 'hayashi-weather:last-place',
    language: 'hayashi-weather:language',
} as const
