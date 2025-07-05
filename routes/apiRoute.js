import express from 'express'
import { obtenerPropiedades, obtenerPropiedadesCategoria, obtenerFavoritos, obtenerPropiedadesAdmin, obtenerPropiedadesFiltradas, obtenerPropiedadesPublicas } from '../controllers/apiControllers.js'
import { protegerRuta, validarVendedor, validarComprador } from '../middlewares/protegerRuta.js'

const router = express.Router()

router.get('/propiedades/publicas', obtenerPropiedadesPublicas)
router.get('/propiedades', protegerRuta, obtenerPropiedades)
router.get('/propiedades/filtradas', protegerRuta, obtenerPropiedadesFiltradas)
router.get('/propiedades/categoria/:id', protegerRuta, obtenerPropiedadesCategoria)
router.get('/favoritos/:id', protegerRuta, obtenerFavoritos)
router.get('/propiedades/admin', protegerRuta, obtenerPropiedadesAdmin)

export default router