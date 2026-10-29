import type { ReactNode } from 'react'
import type { Messages } from './en'

export const es: Messages = {
    languageName: 'Español',

    home: 'Inicio de Hayashi Weather',
    searchPlaceholder: 'Buscar una ciudad',
    matchingPlaces: 'Lugares encontrados',
    searching: 'Buscando…',
    noPlaces: 'No se encontraron lugares',
    useMyLocation: 'Usar mi ubicación',
    temperatureUnits: 'Unidad de temperatura',
    language: 'Idioma',
    savedPlaces: 'Lugares guardados',
    clearRecents: 'Borrar lugares recientes',

    errors: {
        forecastUnavailable:
            'El servicio meteorológico no está disponible en este momento. Inténtalo de nuevo.',
        searchUnavailable:
            'La búsqueda de lugares no está disponible en este momento. Inténtalo de nuevo.',
        noLocationName: 'No encontramos un nombre para tu ubicación.',
        generic: 'Algo salió mal. Inténtalo de nuevo.',
        locationUnsupported: 'Tu navegador no admite la ubicación.',
        locationFailed:
            'No pudimos obtener tu ubicación. Revisa los permisos del navegador o busca una ciudad.',
    },
    tryAgain: 'Reintentar',
    loadingForecast: 'Cargando pronóstico',
    myLocation: 'Mi ubicación',

    welcomeTitle: 'El tiempo en cualquier lugar',
    welcomeLead:
        'Condiciones actuales, gráfico por horas y pronóstico de 7 días. Busca una ciudad arriba o usa tu ubicación.',
    findingLocation: 'Buscando tu ubicación…',
    orTry: 'O prueba',
    suggestions: ['Londres', 'Nueva York', 'Tokio', 'São Paulo', 'Sídney'],

    addFavorite: 'Añadir a favoritos',
    removeFavorite: 'Quitar de favoritos',
    localTime: (time: string) => `${time} hora local`,
    high: (value: string) => `Máx. ${value}`,
    low: (value: string) => `Mín. ${value}`,
    feelsLikeValue: (value: string) => `Sensación de ${value}`,

    highlights: 'Destacados de hoy',
    feelsLike: 'Sensación térmica',
    feelsSame: 'Igual a la temperatura real',
    feelsWarmer: 'Más cálida que la temperatura real',
    feelsCooler: 'Más fría que la temperatura real',
    humidity: 'Humedad',
    humid: 'Húmedo',
    dry: 'Seco',
    comfortable: 'Agradable',
    wind: 'Viento',
    windFrom: (direction: string) => `Del ${direction}`,
    compass: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
    uvIndex: 'Índice UV',
    uvLevels: ['Bajo', 'Moderado', 'Alto', 'Muy alto', 'Extremo'],
    precipitation: 'Precipitación',
    chanceToday: (percent: number) => `${percent}% de probabilidad hoy`,
    pressure: 'Presión',
    atSeaLevel: 'Al nivel del mar',
    visibility: 'Visibilidad',
    clearView: 'Buena visibilidad',
    reducedVisibility: 'Visibilidad reducida',
    sunriseSunset: 'Amanecer y atardecer',
    sunsetAt: (time: string) => `Atardecer ${time}`,

    hourlyTitle: 'Pronóstico por horas',
    hourlyDay: (day: string) => `${day}, por horas`,
    hourlyScrollable: 'Pronóstico por horas, desplazable',
    now: 'Ahora',
    sevenDay: 'Pronóstico de 7 días',
    today: 'Hoy',
    conditions: 'Condiciones',
    maxWind: 'Viento máx.',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',

    weatherDataBy: 'Datos meteorológicos:',
    placesBy: 'Lugares: Open-Meteo y',
    aboutContact: 'Acerca de y contacto',
    sourceCode: 'Código fuente',
    madeBy: 'Hecho por Tsuyoshi',
    aboutTitle: 'Acerca de Hayashi Weather',
    aboutIntro: (mead: ReactNode) => (
        <>
            Hayashi Weather comenzó como un proyecto de un curso de Node.js de {mead} en Udemy. La
            versión 2 es una reescritura como una aplicación React estática y rápida.
        </>
    ),
    aboutData: (openMeteo: ReactNode, nominatim: ReactNode) => (
        <>
            El pronóstico y la búsqueda de lugares provienen de {openMeteo}. Cuando usas tu
            ubicación, el nombre del lugar proviene de {nominatim} (© colaboradores de
            OpenStreetMap). Tu ubicación solo se usa para el pronóstico y nunca se guarda en un
            servidor.
        </>
    ),
    getInTouch: 'Contacto',
    yourEmail: 'Tu correo electrónico',
    message: 'Mensaje',
    sendMessage: 'Enviar mensaje',
    close: 'Cerrar',
    email: 'Correo',

    weather: {
        0: 'Cielo despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla helada',
        51: 'Llovizna ligera',
        53: 'Llovizna',
        55: 'Llovizna intensa',
        56: 'Llovizna helada',
        57: 'Llovizna helada intensa',
        61: 'Lluvia ligera',
        63: 'Lluvia',
        65: 'Lluvia fuerte',
        66: 'Lluvia helada',
        67: 'Lluvia helada fuerte',
        71: 'Nevada ligera',
        73: 'Nieve',
        75: 'Nevada fuerte',
        77: 'Granos de nieve',
        80: 'Chubascos ligeros',
        81: 'Chubascos',
        82: 'Chubascos violentos',
        85: 'Chubascos de nieve',
        86: 'Chubascos de nieve fuertes',
        95: 'Tormenta',
        96: 'Tormenta con granizo',
        99: 'Tormenta fuerte con granizo',
    },
    unknownWeather: 'Desconocido',
}
