console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const locationBtn = document.querySelector('#location')
const flipCard = document.querySelector('#flip-card')
const flipIcon = document.querySelector('#weather-icon')
const minTemp = document.querySelector('#min')
const maxTemp = document.querySelector('#max')
const message = document.querySelector('#message')
const loader = document.querySelector('#loader')
const forecast = document.querySelector('#forecast')

const nextDays = document.querySelector('#next-days')
const day1 = document.querySelector('#day1')
const day2 = document.querySelector('#day2')
const day3 = document.querySelector('#day3')
const day4 = document.querySelector('#day4')
const day5 = document.querySelector('#day5')
const day6 = document.querySelector('#day6')
const day7 = document.querySelector('#day7')

const day1W = document.querySelector('#day-w1')
const day2W = document.querySelector('#day-w2')
const day3W = document.querySelector('#day-w3')
const day4W = document.querySelector('#day-w4')
const day5W = document.querySelector('#day-w5')
const day6W = document.querySelector('#day-w6')
const day7W = document.querySelector('#day-w7')

const d1Icon = document.querySelector('#day1-icon')
const d1Min = document.querySelector('#d1-min')
const d1Max = document.querySelector('#d1-max')

const d2Icon = document.querySelector('#day2-icon')
const d2Min = document.querySelector('#d2-min')
const d2Max = document.querySelector('#d2-max')

const d3Icon = document.querySelector('#day3-icon')
const d3Min = document.querySelector('#d3-min')
const d3Max = document.querySelector('#d3-max')

const d4Icon = document.querySelector('#day4-icon')
const d4Min = document.querySelector('#d4-min')
const d4Max = document.querySelector('#d4-max')

const d5Icon = document.querySelector('#day5-icon')
const d5Min = document.querySelector('#d5-min')
const d5Max = document.querySelector('#d5-max')

const d6Icon = document.querySelector('#day6-icon')
const d6Min = document.querySelector('#d6-min')
const d6Max = document.querySelector('#d6-max')

const d7Icon = document.querySelector('#day7-icon')
const d7Min = document.querySelector('#d7-min')
const d7Max = document.querySelector('#d7-max')


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value
    message.style.display = 'block'
    message.textContent = 'Carregando...'
    flipCard.style.display = 'none'
    nextDays.style.display = 'none'
    loader.style.display = 'block'
    forecast.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            message.textContent = data.error
        } else {
            // loader.style.width = '400px'
            loader.style.display = 'none'
            message.textContent = data.Location
            flipIcon.src = icon(data.Forecast.todayId)
            minTemp.textContent = data.Forecast.minTemp
            maxTemp.textContent = data.Forecast.maxTemp
            
            forecast.textContent =  '\n' + 'Agora: ' + JSON.parse(JSON.stringify(data.Forecast.todayStatus)) + '\n\n'
                                    + 'Temperatura: ' + JSON.parse(JSON.stringify(data.Forecast.todayTemp)) + '\n\n'
                                    + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.todayFeel)) + '\n\n'
                                    + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.rainChance)) + '\n\n'
                                    + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.rainMm)) + '\n\n'
                                    + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.umidity))
            flipCard.style.display = 'inline-block'
            forecast.style.height = '250px'

            day1.textContent = JSON.parse(JSON.stringify(data.Forecast.d1))
            day2.textContent = JSON.parse(JSON.stringify(data.Forecast.d2))
            day3.textContent = JSON.parse(JSON.stringify(data.Forecast.d3))
            day4.textContent = JSON.parse(JSON.stringify(data.Forecast.d4))
            day5.textContent = JSON.parse(JSON.stringify(data.Forecast.d5))
            day6.textContent = JSON.parse(JSON.stringify(data.Forecast.d6))
            day7.textContent = JSON.parse(JSON.stringify(data.Forecast.d7))

            day1W.textContent = JSON.parse(JSON.stringify(data.Forecast.d1W))
            day2W.textContent = JSON.parse(JSON.stringify(data.Forecast.d2W))
            day3W.textContent = JSON.parse(JSON.stringify(data.Forecast.d3W))
            day4W.textContent = JSON.parse(JSON.stringify(data.Forecast.d4W))
            day5W.textContent = JSON.parse(JSON.stringify(data.Forecast.d5W))
            day6W.textContent = JSON.parse(JSON.stringify(data.Forecast.d6W))
            day7W.textContent = JSON.parse(JSON.stringify(data.Forecast.d7W))

            d1Icon.src = icon(data.Forecast.d1Id)
            d1Min.textContent = data.Forecast.d1Min
            d1Max.textContent = data.Forecast.d1Max

            d2Icon.src = icon(data.Forecast.d2Id)
            d2Min.textContent = data.Forecast.d2Min
            d2Max.textContent = data.Forecast.d2Max

            d3Icon.src = icon(data.Forecast.d3Id)
            d3Min.textContent = data.Forecast.d3Min
            d3Max.textContent = data.Forecast.d3Max

            d4Icon.src = icon(data.Forecast.d4Id)
            d4Min.textContent = data.Forecast.d4Min
            d4Max.textContent = data.Forecast.d4Max

            d5Icon.src = icon(data.Forecast.d5Id)
            d5Min.textContent = data.Forecast.d5Min
            d5Max.textContent = data.Forecast.d5Max

            d6Icon.src = icon(data.Forecast.d6Id)
            d6Min.textContent = data.Forecast.d6Min
            d6Max.textContent = data.Forecast.d6Max

            d7Icon.src = icon(data.Forecast.d7Id)
            d7Min.textContent = data.Forecast.d7Min
            d7Max.textContent = data.Forecast.d7Max

            nextDays.style.display = 'inline-block'
            console.log(data.Forecast)
        }
    })
})
})

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocalização não suportada pelo seu navegador!')
    }

    message.style.display = 'block'
    message.textContent = 'Carregando...'
    flipCard.style.display = 'none'
    nextDays.style.display = 'none'
    loader.style.display = 'block'
    forecast.textContent = ''

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        fetch('/weather?coords=' + latitude + ',' + longitude).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    message.textContent = data.error
                } else {
                    loader.style.display = 'none'
                    message.textContent = data.Location
                    flipIcon.src = icon(data.Forecast.todayId)
                    minTemp.textContent = data.Forecast.minTemp
                    maxTemp.textContent = data.Forecast.maxTemp
                    forecast.textContent =  '\n' + 'Agora: ' + JSON.parse(JSON.stringify(data.Forecast.todayStatus)) + '\n\n'
                                    + 'Temperatura: ' + JSON.parse(JSON.stringify(data.Forecast.todayTemp)) + '\n\n'
                                    + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.todayFeel)) + '\n\n'
                                    + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.rainChance)) + '\n\n'
                                    + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.rainMm)) + '\n\n'
                                    + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.umidity))
                    flipCard.style.display = 'inline-block'
                    forecast.style.height = '250px'

                    day1.textContent = JSON.parse(JSON.stringify(data.Forecast.d1))
                    day2.textContent = JSON.parse(JSON.stringify(data.Forecast.d2))
                    day3.textContent = JSON.parse(JSON.stringify(data.Forecast.d3))
                    day4.textContent = JSON.parse(JSON.stringify(data.Forecast.d4))
                    day5.textContent = JSON.parse(JSON.stringify(data.Forecast.d5))
                    day6.textContent = JSON.parse(JSON.stringify(data.Forecast.d6))
                    day7.textContent = JSON.parse(JSON.stringify(data.Forecast.d7))

                    day1W.textContent = JSON.parse(JSON.stringify(data.Forecast.d1W))
                    day2W.textContent = JSON.parse(JSON.stringify(data.Forecast.d2W))
                    day3W.textContent = JSON.parse(JSON.stringify(data.Forecast.d3W))
                    day4W.textContent = JSON.parse(JSON.stringify(data.Forecast.d4W))
                    day5W.textContent = JSON.parse(JSON.stringify(data.Forecast.d5W))
                    day6W.textContent = JSON.parse(JSON.stringify(data.Forecast.d6W))
                    day7W.textContent = JSON.parse(JSON.stringify(data.Forecast.d7W))

                    d1Icon.src = icon(data.Forecast.d1Id)
                    d1Min.textContent = data.Forecast.d1Min
                    d1Max.textContent = data.Forecast.d1Max

                    d2Icon.src = icon(data.Forecast.d2Id)
                    d2Min.textContent = data.Forecast.d2Min
                    d2Max.textContent = data.Forecast.d2Max

                    d3Icon.src = icon(data.Forecast.d3Id)
                    d3Min.textContent = data.Forecast.d3Min
                    d3Max.textContent = data.Forecast.d3Max

                    d4Icon.src = icon(data.Forecast.d4Id)
                    d4Min.textContent = data.Forecast.d4Min
                    d4Max.textContent = data.Forecast.d4Max

                    d5Icon.src = icon(data.Forecast.d5Id)
                    d5Min.textContent = data.Forecast.d5Min
                    d5Max.textContent = data.Forecast.d5Max

                    d6Icon.src = icon(data.Forecast.d6Id)
                    d6Min.textContent = data.Forecast.d6Min
                    d6Max.textContent = data.Forecast.d6Max

                    d7Icon.src = icon(data.Forecast.d7Id)
                    d7Min.textContent = data.Forecast.d7Min
                    d7Max.textContent = data.Forecast.d7Max

                    nextDays.style.display = 'inline-block'
                    console.log(data.Forecast)
                }
            })
        })
    })
})

const icon = (code) => {
    if (code < 300) {        // Thunderstorms
        return '/img/weather/stormy-weather.gif'
    } else if (code < 400) { // Drizzle
        return '/img/weather/rainy-weather.gif'
    } else if (code < 600) { // Rain
        return '/img/weather/rainy-weather.gif'
    } else if (code < 700) { // Snow
        return '/img/weather/light-snowy-weather.gif'
    } else if (code < 800) { // Fog
        return '/img/weather/haze-weather.gif'
    } else if (code == 800) { // Clear
        return '/img/weather/sun-weather.gif'
    } else if (code > 800) { // Clouds
        return '/img/weather/cloudy-weather.gif'
    }  
}

