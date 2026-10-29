export type Units = 'metric' | 'imperial'

export interface Place {
    id: string
    name: string
    region?: string
    country?: string
    latitude: number
    longitude: number
}

// Times are local to the place, formatted "YYYY-MM-DDTHH:mm" (dates "YYYY-MM-DD")
export interface CurrentWeather {
    time: string
    temperature: number
    feelsLike: number
    humidity: number
    precipitation: number
    weatherCode: number
    isDay: boolean
    pressure: number
    windSpeed: number
    windDirection: number
    uvIndex: number
    visibilityMeters: number
}

export interface HourForecast {
    time: string
    temperature: number
    precipitationChance: number
    weatherCode: number
    isDay: boolean
}

export interface DayForecast {
    date: string
    weatherCode: number
    max: number
    min: number
    precipitationChance: number
    precipitationSum: number
    sunrise: string
    sunset: string
    uvIndexMax: number
    windSpeedMax: number
}

export interface Forecast {
    units: Units
    // Offset of the place's local time from UTC
    utcOffsetSeconds: number
    current: CurrentWeather
    hourly: HourForecast[]
    // Index in `hourly` of the current hour
    nowIndex: number
    daily: DayForecast[]
}
