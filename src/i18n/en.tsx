import type { ReactNode } from 'react'

export const en = {
    languageName: 'English',

    // Header and search
    home: 'Hayashi Weather home',
    searchPlaceholder: 'Search for a city',
    matchingPlaces: 'Matching places',
    searching: 'Searching…',
    noPlaces: 'No places found',
    useMyLocation: 'Use my location',
    temperatureUnits: 'Temperature units',
    language: 'Language',
    savedPlaces: 'Saved places',
    clearRecents: 'Clear recent places',

    // Errors
    errors: {
        forecastUnavailable: 'The weather service is unavailable right now. Please try again.',
        searchUnavailable: 'Location search is unavailable right now. Please try again.',
        noLocationName: 'We could not find a name for your location.',
        generic: 'Something went wrong. Please try again.',
        locationUnsupported: 'Your browser does not support location.',
        locationFailed:
            'We could not get your location. Check your browser permissions or search for a city.',
    },
    tryAgain: 'Try again',
    loadingForecast: 'Loading forecast',
    myLocation: 'My location',

    // Welcome
    welcomeTitle: 'Weather for anywhere',
    welcomeLead:
        'Current conditions, an hourly chart and a 7-day forecast. Search for a city above or use your location.',
    findingLocation: 'Finding your location…',
    orTry: 'Or try',
    suggestions: ['London', 'New York', 'Tokyo', 'São Paulo', 'Sydney'],

    // Current conditions
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    localTime: (time: string) => `${time} local time`,
    high: (value: string) => `H ${value}`,
    low: (value: string) => `L ${value}`,
    feelsLikeValue: (value: string) => `Feels like ${value}`,

    // Highlights
    highlights: "Today's highlights",
    feelsLike: 'Feels like',
    feelsSame: 'Same as the actual temperature',
    feelsWarmer: 'Warmer than the actual temperature',
    feelsCooler: 'Cooler than the actual temperature',
    humidity: 'Humidity',
    humid: 'Humid',
    dry: 'Dry',
    comfortable: 'Comfortable',
    wind: 'Wind',
    windFrom: (direction: string) => `From the ${direction}`,
    compass: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
    uvIndex: 'UV index',
    uvLevels: ['Low', 'Moderate', 'High', 'Very high', 'Extreme'],
    precipitation: 'Precipitation',
    chanceToday: (percent: number) => `${percent}% chance today`,
    pressure: 'Pressure',
    atSeaLevel: 'At sea level',
    visibility: 'Visibility',
    clearView: 'Clear view',
    reducedVisibility: 'Reduced visibility',
    sunriseSunset: 'Sunrise & sunset',
    sunsetAt: (time: string) => `Sunset ${time}`,

    // Hourly and daily
    hourlyTitle: 'Hourly forecast',
    hourlyDay: (day: string) => `${day}, hourly`,
    hourlyScrollable: 'Hourly forecast, scrollable',
    now: 'Now',
    sevenDay: '7-day forecast',
    today: 'Today',
    conditions: 'Conditions',
    maxWind: 'Max wind',
    sunrise: 'Sunrise',
    sunset: 'Sunset',

    // Footer and about
    weatherDataBy: 'Weather data by',
    placesBy: 'Places by Open-Meteo &',
    aboutContact: 'About & contact',
    sourceCode: 'Source code',
    madeBy: 'Made by Tsuyoshi',
    aboutTitle: 'About Hayashi Weather',
    aboutIntro: (mead: ReactNode) => (
        <>
            Hayashi Weather started as a project for a Node.js course by {mead} on Udemy. Version 2
            is a rewrite as a fast, static React app.
        </>
    ),
    aboutData: (openMeteo: ReactNode, nominatim: ReactNode) => (
        <>
            Forecasts and place search come from {openMeteo}. When you use your location, the place
            name comes from {nominatim} (© OpenStreetMap contributors). Your location is only used
            for the forecast and is never stored on a server.
        </>
    ),
    getInTouch: 'Get in touch',
    yourEmail: 'Your email',
    message: 'Message',
    sendMessage: 'Send message',
    close: 'Close',
    email: 'Email',

    // WMO weather codes
    weather: {
        0: 'Clear sky',
        1: 'Mostly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Freezing fog',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        56: 'Freezing drizzle',
        57: 'Heavy freezing drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Heavy freezing rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light showers',
        81: 'Showers',
        82: 'Violent showers',
        85: 'Snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Severe thunderstorm with hail',
    } as Record<number, string>,
    unknownWeather: 'Unknown',
}

export type Messages = typeof en
