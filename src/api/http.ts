export type ApiErrorCode = 'forecastUnavailable' | 'searchUnavailable' | 'noLocationName'

// Error the UI can explain to the user; the code picks the translated message
export class ApiError extends Error {
    name = 'ApiError'

    constructor(readonly code: ApiErrorCode) {
        super(code)
    }
}

export const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError'

export async function getJson<T>(url: URL, errorCode: ApiErrorCode, signal?: AbortSignal) {
    let response: Response
    try {
        response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    } catch (error) {
        if (isAbortError(error)) throw error
        throw new ApiError(errorCode)
    }

    if (!response.ok) {
        throw new ApiError(errorCode)
    }
    return (await response.json()) as T
}
