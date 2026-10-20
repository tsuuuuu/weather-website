import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import hbs from 'hbs'
import { pagesRouter } from './routes/pages.js'
import { weatherRouter } from './routes/weather.js'
import { geocode, reverseGeocode } from './services/geocode.js'
import { forecast } from './services/forecast.js'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const defaultServices = { geocode, reverseGeocode, forecast }

// Services can be swapped out in tests so no real API is called
export const createApp = (services = defaultServices) => {
    const app = express()

    // Handlebars views; templates/views/layout.hbs wraps every page
    app.set('view engine', 'hbs')
    app.set('views', path.join(rootDir, 'templates/views'))
    hbs.registerPartials(path.join(rootDir, 'templates/partials'))
    app.locals.name = 'Tsuyoshi'

    app.use(express.static(path.join(rootDir, 'public')))
    app.use(
        '/vendor/fontawesome',
        express.static(path.join(rootDir, 'node_modules/@fortawesome/fontawesome-free')),
    )

    app.use(pagesRouter())
    app.use(weatherRouter(services))

    app.use((req, res) => {
        res.status(404).render('404', {
            title: 'Erro 404',
            message: 'Erro 404 - Página não encontrada',
        })
    })

    return app
}
