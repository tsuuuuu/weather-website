const request = require('request')

const forecast = (coordinates, callback) => {
    const url = 'https://api.darksky.net/forecast/e127aafe14c543e29ee52f4c989397c2/' + coordinates + '?lang=pt&units=auto&exclude=hourly,daily,flags'
    //console.log(url)
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather services!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            callback(undefined, {
                Clima_Atual: body.currently.summary,
                Temperatura_Atual: body.currently.temperature+'°C',
                Chance_de_chuva: body.currently.precipProbability*100+'%'
            })
        }
    })
}

module.exports = forecast