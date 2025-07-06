import express from 'express'
import { protegerRuta } from '../middlewares/protegerRuta.js'
import { 
    enviarMensaje, 
    enviarMensajePost,
    obtenerMensajesComprador,
    obtenerMensajesVendedor,
    verMensaje,
    responderMensaje,
    responderMensajePost,
    responderMensajeComprador,
    responderMensajeCompradorPost,
    editarMensaje,
    editarMensajePost,
    eliminarMensaje,
    obtenerMensajesNoLeidos
} from '../controllers/MensajeControllers.js'

const router = express.Router()

// Enviar mensaje
router.get('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensaje)
router.post('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensajePost)

// Obtener mensajes
router.get('/obtener/comprador', protegerRuta, obtenerMensajesComprador)
router.get('/obtener/vendedor', protegerRuta, obtenerMensajesVendedor)

// Ver mensaje
router.get('/ver/:id', protegerRuta, verMensaje)

// Responder mensaje
router.get('/responder/:id', protegerRuta, responderMensaje)
router.post('/responder/:id', protegerRuta, responderMensajePost)

// Responder mensaje comprador
router.get('/responder/comprador/:id', protegerRuta, responderMensajeComprador)
router.post('/responder/comprador/:id', protegerRuta, responderMensajeCompradorPost)

// Editar mensaje
router.get('/editar/:id', protegerRuta, editarMensaje)
router.post('/editar/:id', protegerRuta, editarMensajePost)

// Eliminar mensaje
router.post('/eliminar/:id', protegerRuta, eliminarMensaje)

// Obtener mensajes no leídos
router.get('/no-leidos', protegerRuta, obtenerMensajesNoLeidos)

export default router
