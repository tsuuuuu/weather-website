import { useEffect, useState } from 'react'
import { isAbortError } from '../api/http'
import { searchPlaces } from '../api/places'
import type { Language } from '../i18n/languages'
import type { Place } from '../types'

const DEBOUNCE_MS = 250
const MIN_LENGTH = 2

interface SearchState {
    key: string
    results: Place[]
    failed?: boolean
}

// Autocomplete results for a search box, debounced and cancelled as the user types
export function usePlaceSearch(query: string, language: Language) {
    const trimmed = query.trim()
    const key = `${language}:${trimmed}`
    const [state, setState] = useState<SearchState>({ key: '', results: [] })

    useEffect(() => {
        if (trimmed.length < MIN_LENGTH) return

        const controller = new AbortController()
        const timer = window.setTimeout(() => {
            searchPlaces(trimmed, language, controller.signal)
                .then((results) => setState({ key, results }))
                .catch((error: unknown) => {
                    if (isAbortError(error)) return
                    setState({ key, results: [], failed: true })
                })
        }, DEBOUNCE_MS)

        return () => {
            window.clearTimeout(timer)
            controller.abort()
        }
    }, [trimmed, language, key])

    const active = trimmed.length >= MIN_LENGTH
    const current = active && state.key === key
    return {
        results: current ? state.results : [],
        failed: current && !!state.failed,
        loading: active && !current,
    }
}
