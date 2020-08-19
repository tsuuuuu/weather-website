const request = require('request')

const forecast = (latitude, longitude, callback) => {
    //const url = 'https://api.darksky.net/forecast/' + process.env.DARKSKY_API_KEY + '/' + coordinates + '?lang=pt&units=si&exclude=hourly,flags'
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=pt_br&units=metric&exclude=minutely,hourly&appid=${process.env.OPENWEATHER_API_KEY}`
    //console.log(url)
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather services!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            callback(undefined, {
                Clima_Atual: body.current.weather[0].description,
                Temperatura_Atual: body.current.temp+'°C',
                Sensacao_termica: body.current.feels_like+'°C',
                Chance_de_chuva: body.daily[0].pop*100+'%',
                Qtd_chuva: body.daily[0].rain+'mm',
                Umidade: body.daily[0].humidity+'%'
                // Clima_Atual: body.currently.summary,
                // Temperatura_Atual: body.currently.temperature+'°C',
                // Chance_de_chuva: body.currently.precipProbability*100+'%'
            })
        }
    })
}

module.exports = forecast