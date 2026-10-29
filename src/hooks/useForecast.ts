import { useEffect, useState } from 'react'
import { fetchForecast } from '../api/forecast'
import { ApiError, isAbortError, type ApiErrorCode } from '../api/http'
import type { Forecast, Place, Units } from '../types'

type ForecastState =
    | { status: 'idle' }
    | { status: 'loading'; forecast?: Forecast }
    | { status: 'ready'; forecast: Forecast }
    // A null error code means an unexpected error
    | { status: 'error'; error: ApiErrorCode | null; forecast?: Forecast }

export function useForecast(place: Place | undefined, units: Units) {
    const [state, setState] = useState<ForecastState>({ status: 'idle' })
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        if (!place) return

        const controller = new AbortController()
        // Keep showing the previous forecast while the next one loads
        setState((previous) => ({
            status: 'loading',
            forecast: 'forecast' in previous ? previous.forecast : undefined,
        }))

        fetchForecast(place.latitude, place.longitude, units, controller.signal)
            .then((forecast) => setState({ status: 'ready', forecast }))
            .catch((error: unknown) => {
                if (isAbortError(error)) return
                setState({
                    status: 'error',
                    error: error instanceof ApiError ? error.code : null,
                })
            })

        return () => controller.abort()
    }, [place, units, attempt])

    return { ...state, retry: () => setAttempt((n) => n + 1) }
}
