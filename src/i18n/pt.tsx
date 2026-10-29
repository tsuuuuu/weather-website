import type { ReactNode } from 'react'
import type { Messages } from './en'

export const pt: Messages = {
    languageName: 'Português',

    home: 'Página inicial do Hayashi Weather',
    searchPlaceholder: 'Buscar uma cidade',
    matchingPlaces: 'Locais encontrados',
    searching: 'Buscando…',
    noPlaces: 'Nenhum local encontrado',
    useMyLocation: 'Usar minha localização',
    temperatureUnits: 'Unidade de temperatura',
    language: 'Idioma',
    savedPlaces: 'Locais salvos',
    clearRecents: 'Limpar locais recentes',

    errors: {
        forecastUnavailable: 'O serviço de previsão está indisponível no momento. Tente novamente.',
        searchUnavailable: 'A busca de locais está indisponível no momento. Tente novamente.',
        noLocationName: 'Não encontramos um nome para a sua localização.',
        generic: 'Algo deu errado. Tente novamente.',
        locationUnsupported: 'Seu navegador não oferece suporte à localização.',
        locationFailed:
            'Não foi possível obter sua localização. Verifique as permissões do navegador ou busque uma cidade.',
    },
    tryAgain: 'Tentar novamente',
    loadingForecast: 'Carregando previsão',
    myLocation: 'Minha localização',

    welcomeTitle: 'O tempo em qualquer lugar',
    welcomeLead:
        'Condições atuais, gráfico por hora e previsão para 7 dias. Busque uma cidade acima ou use sua localização.',
    findingLocation: 'Buscando sua localização…',
    orTry: 'Ou experimente',
    suggestions: ['Londres', 'Nova York', 'Tóquio', 'São Paulo', 'Sydney'],

    addFavorite: 'Adicionar aos favoritos',
    removeFavorite: 'Remover dos favoritos',
    localTime: (time: string) => `${time} no horário local`,
    high: (value: string) => `Máx. ${value}`,
    low: (value: string) => `Mín. ${value}`,
    feelsLikeValue: (value: string) => `Sensação de ${value}`,

    highlights: 'Destaques de hoje',
    feelsLike: 'Sensação térmica',
    feelsSame: 'Igual à temperatura real',
    feelsWarmer: 'Mais quente que a temperatura real',
    feelsCooler: 'Mais fria que a temperatura real',
    humidity: 'Umidade',
    humid: 'Úmido',
    dry: 'Seco',
    comfortable: 'Confortável',
    wind: 'Vento',
    windFrom: (direction: string) => `Vindo de ${direction}`,
    compass: ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'],
    uvIndex: 'Índice UV',
    uvLevels: ['Baixo', 'Moderado', 'Alto', 'Muito alto', 'Extremo'],
    precipitation: 'Precipitação',
    chanceToday: (percent: number) => `${percent}% de chance hoje`,
    pressure: 'Pressão',
    atSeaLevel: 'Ao nível do mar',
    visibility: 'Visibilidade',
    clearView: 'Boa visibilidade',
    reducedVisibility: 'Visibilidade reduzida',
    sunriseSunset: 'Nascer e pôr do sol',
    sunsetAt: (time: string) => `Pôr do sol ${time}`,

    hourlyTitle: 'Previsão por hora',
    hourlyDay: (day: string) => `${day}, por hora`,
    hourlyScrollable: 'Previsão por hora, rolável',
    now: 'Agora',
    sevenDay: 'Previsão para 7 dias',
    today: 'Hoje',
    conditions: 'Condições',
    maxWind: 'Vento máx.',
    sunrise: 'Nascer do sol',
    sunset: 'Pôr do sol',

    weatherDataBy: 'Dados meteorológicos:',
    placesBy: 'Locais: Open-Meteo e',
    aboutContact: 'Sobre e contato',
    sourceCode: 'Código-fonte',
    madeBy: 'Feito por Tsuyoshi',
    aboutTitle: 'Sobre o Hayashi Weather',
    aboutIntro: (mead: ReactNode) => (
        <>
            O Hayashi Weather começou como um projeto de um curso de Node.js do professor {mead} na
            Udemy. A versão 2 foi reescrita como um aplicativo React estático e rápido.
        </>
    ),
    aboutData: (openMeteo: ReactNode, nominatim: ReactNode) => (
        <>
            A previsão e a busca de locais vêm da {openMeteo}. Quando você usa sua localização, o
            nome do local vem do {nominatim} (© colaboradores do OpenStreetMap). Sua localização é
            usada apenas para a previsão e nunca é armazenada em um servidor.
        </>
    ),
    getInTouch: 'Entre em contato',
    yourEmail: 'Seu e-mail',
    message: 'Mensagem',
    sendMessage: 'Enviar mensagem',
    close: 'Fechar',
    email: 'E-mail',

    weather: {
        0: 'Céu limpo',
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro com geada',
        51: 'Garoa fraca',
        53: 'Garoa',
        55: 'Garoa intensa',
        56: 'Garoa congelante',
        57: 'Garoa congelante intensa',
        61: 'Chuva fraca',
        63: 'Chuva',
        65: 'Chuva forte',
        66: 'Chuva congelante',
        67: 'Chuva congelante forte',
        71: 'Neve fraca',
        73: 'Neve',
        75: 'Neve forte',
        77: 'Grãos de neve',
        80: 'Pancadas de chuva fracas',
        81: 'Pancadas de chuva',
        82: 'Pancadas de chuva violentas',
        85: 'Pancadas de neve',
        86: 'Pancadas de neve fortes',
        95: 'Trovoada',
        96: 'Trovoada com granizo',
        99: 'Trovoada forte com granizo',
    },
    unknownWeather: 'Desconhecido',
}
