import { Router } from 'express'
import { AppError } from '../lib/http.js'

const parseCoordinate = (value, limit) => {
    const number = Number.parseFloat(value)
    return Number.isFinite(number) && Math.abs(number) <= limit ? number : undefined
}

// GET /weather?address=Campinas  or  GET /weather?lat=-22.9&lon=-47.06
export const weatherRouter = ({ geocode, reverseGeocode, forecast }) => {
    const router = Router()

    router.get('/weather', async (req, res) => {
        const { address, lat, lon } = req.query

        try {
            if (typeof address === 'string' && address.trim()) {
                const place = await geocode(address)
                const weather = await forecast(place.latitude, place.longitude)
                return res.json({ location: place.location, ...weather })
            }

            if (lat !== undefined || lon !== undefined) {
                const latitude = parseCoordinate(lat, 90)
                const longitude = parseCoordinate(lon, 180)
                if (latitude === undefined || longitude === undefined) {
                    throw new AppError('Coordenadas inválidas!', 400)
                }

                // The forecast still works when the place name can't be found
                const [location, weather] = await Promise.all([
                    reverseGeocode(latitude, longitude).catch(
                        () => `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                    ),
                    forecast(latitude, longitude),
                ])
                return res.json({ location, ...weather })
            }

            throw new AppError('Você deve fornecer uma localização!', 400)
        } catch (error) {
            if (!(error instanceof AppError)) {
                console.error(error)
            }
            const status = error instanceof AppError ? error.status : 500
            const message =
                error instanceof AppError ? error.message : 'Algo deu errado, tente novamente!'
            res.status(status).json({ error: message })
        }
    })

    return router
}
