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
import  { protegerRuta, validarAdministrador } from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'

const router = express.Router()

// Panel principal del administrador
router.get('/panel', protegerRuta, validarAdministrador, panelAdministrador)

// Gestión de usuarios
router.get('/usuarios', protegerRuta, validarAdministrador, panelAdministradorUsuarios)
router.get('/usuarios/crear', protegerRuta, validarAdministrador, crearUsuarioAdministrador)
router.post('/usuarios/crear', protegerRuta, validarAdministrador, crearUsuarioAdministradorPost)
router.get('/usuarios/editar/:id', protegerRuta, validarAdministrador, editarUsuarioAdministrador)
router.post('/usuarios/editar/:id', protegerRuta, validarAdministrador, editarUsuarioAdministradorPost)
router.post('/usuarios/eliminar/:id', protegerRuta, eliminarUsuarioAdministrador)

// Gestión de propiedades
router.get('/propiedades', protegerRuta, validarAdministrador, panelAdministradorPropiedades)
router.get('/propiedades/crear', protegerRuta, validarAdministrador, crearPropiedadAdministrador)
router.post('/propiedades/crear', protegerRuta, validarAdministrador, crearPropiedadAdministradorPost)
router.get('/propiedades/agregar-imagen/:id', protegerRuta, validarAdministrador, agregarImagenAdministradorPropiedad)
router.post('/propiedades/agregar-imagen/:id', protegerRuta, validarAdministrador, upload.single('imagenAdmin'), subirImagenAdministradorPropiedad)
router.get('/propiedades/editar/:id', protegerRuta, validarAdministrador, editarPropiedadAdministrador)
router.post('/propiedades/editar/:id', protegerRuta, validarAdministrador, editarPropiedadAdministradorPost)
router.post('/propiedades/eliminar/:id', protegerRuta, validarAdministrador, eliminarPropiedadAdministrador)

// Gestión de categorías
router.get('/categorias', protegerRuta, validarAdministrador, panelAdministradorCategorias)
router.get('/categorias/crear', protegerRuta, validarAdministrador, crearCategoriaAdministrador)
router.post('/categorias/crear', protegerRuta, validarAdministrador, crearCategoriaAdministradorPost)
router.post('/categorias/eliminar/:id', protegerRuta, validarAdministrador, eliminarCategoriaAdministrador)
router.get('/categorias/editar/:id', protegerRuta, validarAdministrador, editarCategoriaAdministrador)
router.post('/categorias/editar/:id', protegerRuta, validarAdministrador, editarCategoriaAdministradorPost)

// Gestión de mensajes
router.get('/mensajes', protegerRuta, validarAdministrador, panelAdministradorMensajes)
router.post('/mensajes/eliminar/:id', protegerRuta, validarAdministrador, eliminarMensajeAdministrador)
router.get('/mensajes/ver/:id', protegerRuta, validarAdministrador, verMensajeAdministrador)

// Perfil del administrador
router.get('/perfil', protegerRuta, validarAdministrador, panelAdministradorPerfil)
router.post('/perfil', protegerRuta, validarAdministrador, editarPerfilAdministradorPost)

export default router 