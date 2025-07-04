import express from 'express'
import { registrarPropiedad, publicarPropiedad, agregarImagen, almacenarImagen, misPropiedades, editarPropiedad, actualizarPropiedad, eliminarPropiedad, cambiarEstado, obtenerPropiedades, buscarPropiedades, verPropiedad, obtenerCategorias, cambiarEstadoDesactivar, cambiarEstadoActivar } from '../controllers/propiedadControllers.js'
import { obtenerPropiedadesCategoria, obtenerPropiedadesFiltradas } from '../controllers/apiControllers.js'
import { protegerRuta, validarVendedor, validarComprador } from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'


const router = express.Router()


router.get('/crearPropiedad', protegerRuta, validarVendedor, registrarPropiedad)
router.post('/crearPropiedad', protegerRuta, validarVendedor, publicarPropiedad)

router.get('/agregar-imagen/:id', protegerRuta, validarVendedor, agregarImagen)
router.post('/agregar-imagen/:id', protegerRuta, validarVendedor, upload.single('imagen'), almacenarImagen)

// Propiedades Categorias
router.get('/categorias/:id', protegerRuta, obtenerCategorias)


// Editar propiedad
router.get('/editar/:id', protegerRuta, validarVendedor, editarPropiedad)
router.post('/actualizar/:id', protegerRuta, validarVendedor, actualizarPropiedad)

// Eliminar propiedad
router.post('/eliminar/:id', protegerRuta, validarVendedor, eliminarPropiedad)

// Cambiar estado 
// Desde javascript para evitar que se recargue la pagina
router.put('/estado/:id', protegerRuta, validarVendedor, cambiarEstado)
// Desde url para que se recargue la pagina
router.get('/desactivar/:id', protegerRuta, validarVendedor, cambiarEstadoDesactivar)
router.get('/activar/:id', protegerRuta, validarVendedor, cambiarEstadoActivar)

// Mis propiedades
router.get('/mis-propiedades', protegerRuta, validarVendedor, misPropiedades)


// Api para obtener todas las propiedades
router.get('/api/propiedades', protegerRuta, obtenerPropiedades)
// Api para obtener propiedades filtradas
router.get('/api/propiedades/filtradas', protegerRuta, obtenerPropiedadesFiltradas)

// Buscar propiedades
router.get('/buscar', protegerRuta, buscarPropiedades)

// Ver una propiedad en detalle
router.get('/:id', protegerRuta, verPropiedad)

export default router