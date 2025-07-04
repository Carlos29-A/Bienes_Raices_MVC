import express from 'express'
import  { protegerRuta, validarVendedor, validarComprador } from '../middlewares/protegerRuta.js'
import { enviarMensaje, obtenerMensajesComprador, eliminarMensaje, enviarMensajePost, editarMensaje, editarMensajePost, obtenerMensajesVendedor, verMensaje, responderMensaje, responderMensajePost, responderMensajeComprador, responderMensajeCompradorPost } from '../controllers/MensajeControllers.js'

const router = express.Router()

router.get('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensaje)
router.post('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensajePost)

// obtener mensajes del comprador
router.get('/obtener/comprador', protegerRuta, obtenerMensajesComprador)
// obtener mensajes del vendedor
router.get('/obtener/vendedor', protegerRuta, obtenerMensajesVendedor)
// Ver mensaje
router.get('/ver/:id', protegerRuta, verMensaje)
// Responder mensaje tanto para el comprador como para el vendedor
router.get('/responder/:id', protegerRuta, responderMensaje)
router.post('/responder/:id', protegerRuta, responderMensajePost)

// Responder mensaje para el comprador
router.get('/responder/comprador/:id', protegerRuta, responderMensajeComprador)
router.post('/responder/comprador/:id', protegerRuta, responderMensajeCompradorPost)



// Editar mensaje
router.get('/editar/:id', protegerRuta, editarMensaje)
router.post('/editar/:id', protegerRuta, editarMensajePost)
router.post('/eliminar/:id', protegerRuta, eliminarMensaje)



export default router
