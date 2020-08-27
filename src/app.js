const path = require('path')
const express = require('express')
const hbs = require('hbs')
const {geocode, revGeocode} = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Previsão do tempo',
        name: 'Tsuyoshi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Sobre esta página',
        name: 'Tsuyoshi'
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contato',
        name: 'Tsuyoshi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Ajuda',
        name: 'Tsuyoshi',
        message: 'This is the help page'
    })
})

app.get('/weather', (req, res) => {
    if ((!req.query.address) && (!req.query.coords)) {
        return res.send ({
            error: "Você deve fornecer uma localização!"
        })
    }
    
    if (!req.query.coords) {
        const location = req.query.address
        geocode(location, (error,{latitude, longitude, location} = {}) => {
            if (error){
                return res.send(error)
            } 
            //console.log(data)
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send (error)
                }
                res.send ({
                    Location: location,
                    Forecast: forecastData
                })
            })
        })
    } else {
        const location = req.query.coords
        const locArray = location.split(',')
        const latitude = locArray[0].slice(0,11)
        const longitude = locArray[1].slice(0,11)
        //console.log(location)
        const revGeolocation = revGeocode(latitude,longitude, (error, {city, county}) => {
            if (error){
                return res.send(error)
            }
            forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send (error)
            }
            res.send ({
                Location: `${city} - ${county}`,
                Forecast: forecastData
            })
        }) 
        }) 
    }
})


// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: "You must provide a search term"
//         })
//     }

//     console.log(req.query.search)
//     res.send ({
//         products: []
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Tsuyoshi',
        message: 'Erro 404 - Página de ajuda não encontrada'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Tsuyoshi',
        message: 'Erro 404 - Página não encontrada'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})