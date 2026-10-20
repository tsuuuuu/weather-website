const TIMEOUT_MS = 10_000
const USER_AGENT = 'hayashi-weather-app (https://github.com/tsuuuuu/weather-website)'

// Error whose message is safe to show to the user
export class AppError extends Error {
    constructor(message, status = 500) {
        super(message)
        this.name = 'AppError'
        this.status = status
    }
}

// GET a JSON resource, turning network failures and timeouts into an AppError
export const getJson = async (url, unavailableMessage) => {
    let response
    try {
        response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        })
    } catch {
        throw new AppError(unavailableMessage, 502)
    }

    if (!response.ok) {
        throw new AppError(unavailableMessage, 502)
    }
    return response.json()
}
