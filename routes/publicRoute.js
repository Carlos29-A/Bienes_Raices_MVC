import express from 'express'
import { paginaPrincipal, nosotros, contacto, buscarPropiedades, verPropiedad, enviarContacto, verPerfilVendedor } from '../controllers/publicControllers.js'
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
// Ver perfil vendedor
route.get('/verPerfilVendedor/:id', verPerfilVendedor)

// Contacto
route.get('/contacto', contacto)
route.post('/contacto', enviarContacto)

export default route;
