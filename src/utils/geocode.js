const request = require('request')

const geocode = (location, callback) => {
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(location) + '&key=' + process.env.OPENCAGEDATA_API_KEY + '&limit=1'
    //console.log(url)
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback({error:'Unable to connect to location services!'})
        } else if (body.total_results === 0) {
            callback({error:'Unable to find location. Try another search'})
        } else {
            callback (undefined, {
                latitude: body.results[0].geometry.lat,
                longitude: body.results[0].geometry.lng,
                location: body.results[0].formatted
            })
        }
    })
}

const revGeocode = (latitude, longitude, callback) => {
    const url = 'https://api.opencagedata.com/geocode/v1/json?q='+ latitude + ',' + longitude + '&key=' + process.env.OPENCAGEDATA_API_KEY 
    //console.log(url)
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback({error:'Unable to connect to location services!'})
        } else if (body.total_results === 0) {
            callback({error:'Unable to find location. Try another search'})
        } else {
            callback (undefined, {
                city: body.results[0].components.city,
                county: body.results[0].components.county
            })
        }
    })
}

module.exports = {
    geocode,
    revGeocode
}