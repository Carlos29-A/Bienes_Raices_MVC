import express from 'express'
import { registrarPropiedad, publicarPropiedad, agregarImagen, almacenarImagen, misPropiedades, editarPropiedad, actualizarPropiedad, eliminarPropiedad, cambiarEstado, obtenerPropiedades, buscarPropiedades, verPropiedad } from '../controllers/propiedadControllers.js'
import protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'


const router = express.Router()


router.get('/crearPropiedad', protegerRuta, registrarPropiedad)
router.post('/crearPropiedad', protegerRuta, publicarPropiedad)

router.get('/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post('/agregar-imagen/:id', protegerRuta, upload.single('imagen'), almacenarImagen)

// Editar propiedad
router.get('/editar/:id', protegerRuta, editarPropiedad)
router.post('/actualizar/:id', protegerRuta, actualizarPropiedad)

// Eliminar propiedad
router.post('/eliminar/:id', protegerRuta, eliminarPropiedad)

// Cambiar estado
router.put('/estado/:id', protegerRuta, cambiarEstado)

// Mis propiedades
router.get('/mis-propiedades', protegerRuta, misPropiedades)


// Api para obtener todas las propiedades
router.get('/api/propiedades', protegerRuta, obtenerPropiedades)

// Buscar propiedades
router.get('/buscar', protegerRuta, buscarPropiedades)

// Ver una propiedad en detalle
router.get('/:id', protegerRuta, verPropiedad)

export default router