import express from 'express'
import { registrarPropiedad, publicarPropiedad, agregarImagen, almacenarImagen } from '../controllers/propiedadControllers.js'
import protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'


const router = express.Router()


router.get('/crearPropiedad', protegerRuta, registrarPropiedad)
router.post('/crearPropiedad', protegerRuta, publicarPropiedad)

router.get('/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post('/agregar-imagen/:id', protegerRuta, upload.single('imagen'), almacenarImagen)
export default router