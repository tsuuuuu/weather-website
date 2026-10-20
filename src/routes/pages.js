import { Router } from 'express'

export const pagesRouter = () => {
    const router = Router()

    router.get('/', (req, res) => {
        res.render('index', { title: 'Previsão do tempo', script: '/js/app.js' })
    })

    router.get('/about', (req, res) => {
        res.render('about', { title: 'Sobre esta página' })
    })

    router.get('/contact', (req, res) => {
        res.render('contact', { title: 'Contato' })
    })

    return router
}
