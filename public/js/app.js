const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search')
const myLocationButton = document.querySelector('#my-location')
const message = document.querySelector('#message')
const loader = document.querySelector('#loader')
const flipCard = document.querySelector('#flip-card')
const weatherIcon = document.querySelector('#weather-icon')
const minTemp = document.querySelector('#min')
const maxTemp = document.querySelector('#max')
const forecastText = document.querySelector('#forecast')
const nextDays = document.querySelector('#next-days')
const dayTemplate = document.querySelector('#day-template')

const showLoading = () => {
    message.textContent = 'Carregando...'
    loader.hidden = false
    flipCard.hidden = true
    nextDays.hidden = true
}

const showError = (text) => {
    loader.hidden = true
    message.textContent = text
}

const renderToday = (today) => {
    weatherIcon.src = today.icon
    minTemp.textContent = today.min
    maxTemp.textContent = today.max
    forecastText.textContent = [
        `Agora: ${today.description}`,
        `Temperatura: ${today.temperature}`,
        `Sensação térmica: ${today.feelsLike}`,
        `Chance de chuva: ${today.rainChance}`,
        `Chuva prevista: ${today.rainAmount}`,
        `Umidade do ar: ${today.humidity}`,
    ].join('\n\n')
    flipCard.hidden = false
}

const renderNextDays = (days) => {
    nextDays.replaceChildren(
        ...days.map((day) => {
            const column = dayTemplate.content.cloneNode(true)
            column.querySelector('.day-date').textContent = day.date
            column.querySelector('.day-weekday').textContent = day.weekday
            column.querySelector('.day-icon').src = day.icon
            column.querySelector('.day-min').textContent = day.min
            column.querySelector('.day-max').textContent = day.max
            return column
        }),
    )
    nextDays.hidden = false
}

const loadWeather = async (params) => {
    showLoading()
    try {
        const response = await fetch(`/weather?${new URLSearchParams(params)}`)
        const data = await response.json()
        if (data.error) {
            return showError(data.error)
        }

        loader.hidden = true
        message.textContent = data.location
        renderToday(data.today)
        renderNextDays(data.days)
    } catch {
        showError('Não foi possível carregar a previsão, tente novamente!')
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    loadWeather({ address: searchInput.value })
})

myLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return showError('Geolocalização não suportada pelo seu navegador!')
    }

    showLoading()
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => loadWeather({ lat: coords.latitude, lon: coords.longitude }),
        () => showError('Não foi possível obter sua localização!'),
    )
})
