// WMO weather interpretation codes, as returned by Open-Meteo
// https://open-meteo.com/en/docs#weather_variable_documentation
const ICONS = {
    sun: '/img/weather/sun-weather.gif',
    cloudy: '/img/weather/cloudy-weather.gif',
    haze: '/img/weather/haze-weather.gif',
    rainy: '/img/weather/rainy-weather.gif',
    rainCloud: '/img/weather/rain-cloud-weather.gif',
    torrential: '/img/weather/torrential-rain-weather.gif',
    snowy: '/img/weather/light-snowy-weather.gif',
    stormy: '/img/weather/stormy-weather.gif',
}

const CODES = {
    0: ['Céu limpo', ICONS.sun],
    1: ['Predominantemente limpo', ICONS.sun],
    2: ['Parcialmente nublado', ICONS.cloudy],
    3: ['Nublado', ICONS.cloudy],
    45: ['Nevoeiro', ICONS.haze],
    48: ['Nevoeiro com geada', ICONS.haze],
    51: ['Garoa fraca', ICONS.rainy],
    53: ['Garoa moderada', ICONS.rainy],
    55: ['Garoa intensa', ICONS.rainy],
    56: ['Garoa congelante fraca', ICONS.rainy],
    57: ['Garoa congelante intensa', ICONS.rainy],
    61: ['Chuva fraca', ICONS.rainy],
    63: ['Chuva moderada', ICONS.rainy],
    65: ['Chuva forte', ICONS.torrential],
    66: ['Chuva congelante fraca', ICONS.rainy],
    67: ['Chuva congelante forte', ICONS.torrential],
    71: ['Neve fraca', ICONS.snowy],
    73: ['Neve moderada', ICONS.snowy],
    75: ['Neve forte', ICONS.snowy],
    77: ['Grãos de neve', ICONS.snowy],
    80: ['Pancadas de chuva fracas', ICONS.rainCloud],
    81: ['Pancadas de chuva moderadas', ICONS.rainCloud],
    82: ['Pancadas de chuva violentas', ICONS.torrential],
    85: ['Pancadas de neve fracas', ICONS.snowy],
    86: ['Pancadas de neve fortes', ICONS.snowy],
    95: ['Trovoada', ICONS.stormy],
    96: ['Trovoada com granizo fraco', ICONS.stormy],
    99: ['Trovoada com granizo forte', ICONS.stormy],
}

export const describeWeather = (code) => {
    const [description, icon] = CODES[code] ?? ['Indisponível', ICONS.cloudy]
    return { description, icon }
}
