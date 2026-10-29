// WMO weather interpretation codes, as returned by Open-Meteo
// https://open-meteo.com/en/docs#weather_variable_documentation
// Labels for each code live in the translations (src/i18n).

export type WeatherKind =
    | 'clear'
    | 'partly-cloudy'
    | 'cloudy'
    | 'fog'
    | 'drizzle'
    | 'rain'
    | 'heavy-rain'
    | 'snow'
    | 'storm'

const KINDS: Record<number, WeatherKind> = {
    0: 'clear',
    1: 'clear',
    2: 'partly-cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    56: 'drizzle',
    57: 'drizzle',
    61: 'rain',
    63: 'rain',
    65: 'heavy-rain',
    66: 'rain',
    67: 'heavy-rain',
    71: 'snow',
    73: 'snow',
    75: 'snow',
    77: 'snow',
    80: 'rain',
    81: 'rain',
    82: 'heavy-rain',
    85: 'snow',
    86: 'snow',
    95: 'storm',
    96: 'storm',
    99: 'storm',
}

export const weatherKind = (code: number): WeatherKind => KINDS[code] ?? 'cloudy'

export const weatherLabel = (
    t: { weather: Record<number, string>; unknownWeather: string },
    code: number,
) => t.weather[code] ?? t.unknownWeather
