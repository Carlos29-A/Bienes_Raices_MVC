import express from 'express'
import  protegerRuta  from '../middlewares/protegerRuta.js'
import { enviarMensaje, obtenerMensajes, eliminarMensaje, enviarMensajePost, editarMensaje, editarMensajePost, obtenerMensajesVendedor } from '../controllers/MensajeControllers.js'

const router = express.Router()

router.get('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensaje)
router.post('/enviar/:idPropiedad/:idVendedor', protegerRuta, enviarMensajePost)

router.get('/obtener', protegerRuta, obtenerMensajes)
router.get('/obtener/vendedor', protegerRuta, obtenerMensajesVendedor)

router.get('/editar/:id', protegerRuta, editarMensaje)
router.post('/editar/:id', protegerRuta, editarMensajePost)
router.post('/eliminar/:id', protegerRuta, eliminarMensaje)

export default router
