import express from 'express'
import { 
    panelAdministrador,
    panelAdministradorUsuarios, 
    panelAdministradorPropiedades, 
    panelAdministradorMensajes, 
    panelAdministradorPerfil, 
    crearUsuarioAdministrador, 
    crearUsuarioAdministradorPost, 
    crearPropiedadAdministrador, 
    crearPropiedadAdministradorPost, 
    agregarImagenAdministradorPropiedad, 
    subirImagenAdministradorPropiedad, 
    crearCategoriaAdministrador, 
    crearCategoriaAdministradorPost, 
    panelAdministradorCategorias, 
    eliminarUsuarioAdministrador, 
    eliminarPropiedadAdministrador, 
    eliminarCategoriaAdministrador, 
    editarCategoriaAdministrador, 
    editarCategoriaAdministradorPost,
    editarUsuarioAdministrador,
    editarUsuarioAdministradorPost,
    editarPropiedadAdministrador,
    editarPropiedadAdministradorPost,
    editarPerfilAdministradorPost,
    eliminarMensajeAdministrador,
    verMensajeAdministrador
} from '../controllers/administradorControllers.js'
import  protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'

const router = express.Router()

// Panel principal del administrador
router.get('/panel', protegerRuta, panelAdministrador)

// Gestión de usuarios
router.get('/usuarios', protegerRuta, panelAdministradorUsuarios)
router.get('/usuarios/crear', protegerRuta, crearUsuarioAdministrador)
router.post('/usuarios/crear', protegerRuta, crearUsuarioAdministradorPost)
router.get('/usuarios/editar/:id', protegerRuta, editarUsuarioAdministrador)
router.post('/usuarios/editar/:id', protegerRuta, editarUsuarioAdministradorPost)
router.post('/usuarios/eliminar/:id', protegerRuta, eliminarUsuarioAdministrador)

// Gestión de propiedades
router.get('/propiedades', protegerRuta, panelAdministradorPropiedades)
router.get('/propiedades/crear', protegerRuta, crearPropiedadAdministrador)
router.post('/propiedades/crear', protegerRuta, crearPropiedadAdministradorPost)
router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagenAdministradorPropiedad)
router.post('/propiedades/agregar-imagen/:id', protegerRuta, upload.single('imagenAdmin'), subirImagenAdministradorPropiedad)
router.get('/propiedades/editar/:id', protegerRuta, editarPropiedadAdministrador)
router.post('/propiedades/editar/:id', protegerRuta, editarPropiedadAdministradorPost)
router.post('/propiedades/eliminar/:id', protegerRuta, eliminarPropiedadAdministrador)

// Gestión de categorías
router.get('/categorias', protegerRuta, panelAdministradorCategorias)
router.get('/categorias/crear', protegerRuta, crearCategoriaAdministrador)
router.post('/categorias/crear', protegerRuta, crearCategoriaAdministradorPost)
router.post('/categorias/eliminar/:id', protegerRuta, eliminarCategoriaAdministrador)
router.get('/categorias/editar/:id', protegerRuta, editarCategoriaAdministrador)
router.post('/categorias/editar/:id', protegerRuta, editarCategoriaAdministradorPost)

// Gestión de mensajes
router.get('/mensajes', protegerRuta, panelAdministradorMensajes)
router.post('/mensajes/eliminar/:id', protegerRuta, eliminarMensajeAdministrador)
router.get('/mensajes/ver/:id', protegerRuta, verMensajeAdministrador)

// Perfil del administrador
router.get('/perfil', protegerRuta, panelAdministradorPerfil)
router.post('/perfil', protegerRuta, editarPerfilAdministradorPost)

export default router 