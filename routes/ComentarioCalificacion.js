import express from 'express'
// Controladores
import { CrearComentarioCalificacion } from '../controllers/ComentarioCalificacion.js'
import  protegerRuta  from '../middlewares/protegerRuta.js'
const router = express.Router()


// Rutas
router.post('/crear-comentario-calificacion/:id', protegerRuta, CrearComentarioCalificacion)


export default router