import express from 'express'
// Controladores
import { CrearComentarioCalificacionPost, crearComentarioCalificacion, editarComentarioCalificacion, editarComentarioCalificacionPost, eliminarComentarioCalificacion } from '../controllers/ComentarioCalificacion.js'
import  { protegerRuta, validarVendedor, validarComprador } from '../middlewares/protegerRuta.js'
const router = express.Router()


// Rutas
router.get('/crear-comentario-calificacion/:id', protegerRuta, crearComentarioCalificacion)
router.post('/crear-comentario-calificacion/:id', protegerRuta, CrearComentarioCalificacionPost)

// Editar comentario calificacion
router.get('/editar-comentario-calificacion/:id', protegerRuta, editarComentarioCalificacion)
router.post('/editar-comentario-calificacion/:id', protegerRuta, editarComentarioCalificacionPost)

// Eliminar comentario calificacion
router.post('/eliminar-comentario-calificacion/:id', protegerRuta, eliminarComentarioCalificacion)

export default router