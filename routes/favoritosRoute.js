import express from 'express'
import protegerRuta from '../middlewares/protegerRuta.js'
import { favoritos, agregarFavorito } from '../controllers/favoritoControllers.js'

const router = express.Router()

router.get('/propiedades-favoritas', protegerRuta, favoritos)
router.post('/:id', protegerRuta, agregarFavorito)

export default router
