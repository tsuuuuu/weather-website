console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const locationBtn = document.querySelector('#location')
const messageOne = document.querySelector('#Message-1')
const messageTwo = document.querySelector('#Message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value
    messageOne.style.display = 'block'
    messageOne.textContent = 'Carregando...'
    messageTwo.style.display = 'none'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            messageOne.textContent = data.error
        } else {
            messageOne.textContent = data.Location
            messageTwo.textContent = 'Condição atual: ' + JSON.parse(JSON.stringify(data.Forecast.Clima_Atual)) + '\n\n'
                                    + 'Temperatura: ' + JSON.parse(JSON.stringify(data.Forecast.Temperatura_Atual)) + '\n\n'
                                    + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.Sensacao_termica)) + '\n\n'
                                    + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.Chance_de_chuva)) + '\n\n'
                                    + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.Qtd_chuva)) + '\n\n'
                                    + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.Umidade))
            messageTwo.style.display = 'grid'
            // messageTwo.style.grid-template-columns = 'repeat(14, 7.14%)'
            messageTwo.style.height = '300px'
            console.log(data.Forecast)
        }
    })
})
})

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocalização não suportada pelo seu navegador!')
    }

    if (!confirm("Utilizar sua localização atual?")){
        return
    }

    messageOne.style.display = 'block'
    messageOne.textContent = 'Carregando...'
    messageTwo.style.display = 'none'
    messageTwo.textContent = ''

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        fetch('/weather?coords=' + latitude + ',' + longitude).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error
                } else {
                    messageOne.textContent = data.Location
                    messageTwo.textContent = 'Clima agora: ' + JSON.parse(JSON.stringify(data.Forecast.Clima_Atual)) + '\n\n'
                                            + 'Temperatura atual: ' + JSON.parse(JSON.stringify(data.Forecast.Temperatura_Atual)) + '\n\n'
                                            + 'Sensação térmica: ' + JSON.parse(JSON.stringify(data.Forecast.Sensacao_termica)) + '\n\n'
                                            + 'Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.Chance_de_chuva)) + '\n\n'
                                            + 'Chuva prevista: ' + JSON.parse(JSON.stringify(data.Forecast.Qtd_chuva)) + '\n\n'
                                            + 'Umidade do ar: ' + JSON.parse(JSON.stringify(data.Forecast.Umidade))
                    messageTwo.style.display = 'grid'
                    // messageTwo.style.grid-template-columns = 'repeat(14, 7.14%)'
                    messageTwo.style.height = '300px'
                    console.log(data.Forecast)
                }
            })
        })
    })
})


