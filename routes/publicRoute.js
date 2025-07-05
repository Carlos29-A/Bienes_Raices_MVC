import express from 'express'
import {paginaPrincipal, nosotros,  contacto, buscarPropiedades, verPropiedad} from '../controllers/publicControllers.js'
import router from './usuriosRoute.js'
const route = express.Router()

// Home
route.get('/', paginaPrincipal)

// Buscar propiedades
route.get('/buscarPropiedades', buscarPropiedades)
// Ver una propiedad en particular
route.get('/propiedad/:id', verPropiedad)
// Nosotros
route.get('/nosotros', nosotros)

// Contacto
route.get('/contacto', contacto)

export default route;
