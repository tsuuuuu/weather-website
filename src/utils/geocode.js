const request = require('request')

const geocode = (location, callback) => {
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(location) + '&key=d7cfa37aa3e241efb43ddc232a9c8b22&limit=1'
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

module.exports = geocode