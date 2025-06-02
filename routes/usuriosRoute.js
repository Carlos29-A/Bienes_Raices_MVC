import express from 'express'
import { registro, login, olvideContraseña, crearUsuario, confirmar, resetearPassword, reestablecerPassword, nuevaContraseña, iniciarSesion, panelVendedor, panelComprador, editarPerfil, actualizarPerfil, cerrarSesion, buscarPropiedades, panelAdministrador, panelAdministradorUsuarios, panelAdministradorPropiedades, panelAdministradorMensajes, panelAdministradorPerfil, crearUsuarioAdministrador, crearUsuarioAdministradorPost, crearPropiedadAdministrador, crearPropiedadAdministradorPost } from '../controllers/usuarioControllers.js'
import protegerRuta from '../middlewares/protegerRuta.js'

const router = express.Router()

// Registro
router.get('/registro', registro)
router.post('/registro', crearUsuario)
router.get('/confirmar/:token', confirmar)

// Olvide contraseña
router.get('/olvide-password', olvideContraseña)
router.post('/olvide-password', resetearPassword)
router.get('/reestablecer-password/:token', reestablecerPassword)
router.post('/reestablecer-password/:token', nuevaContraseña)

// Iniciar sesión
router.get('/login', login)
router.post('/login', iniciarSesion)


// Vendedor
router.get('/vendedor/panel', protegerRuta, panelVendedor)


// Comprador
router.get('/comprador/panel', protegerRuta, panelComprador)
router.get('/comprador/buscar-propiedades', protegerRuta, buscarPropiedades)


// Editar perfil
router.get('/editar-perfil', protegerRuta, editarPerfil)
router.post('/editar-perfil', protegerRuta, actualizarPerfil)

// Cerrar sesión
router.get('/cerrar-sesion', protegerRuta, cerrarSesion)


// Administrador
router.get('/administrador/panel', protegerRuta, panelAdministrador)
router.get('/administrador/usuarios', protegerRuta, panelAdministradorUsuarios)
router.get('/administrador/propiedades', protegerRuta, panelAdministradorPropiedades)
router.get('/administrador/mensajes', protegerRuta, panelAdministradorMensajes)
router.get('/administrador/perfil', protegerRuta, panelAdministradorPerfil)


// Funcionalidade del administrador
router.get('/administrador/usuarios/crear', protegerRuta, crearUsuarioAdministrador)
router.post('/administrador/usuarios/crear', protegerRuta, crearUsuarioAdministradorPost)
router.get('/administrador/propiedades/crear', protegerRuta, crearPropiedadAdministrador)
router.post('/administrador/propiedades/crear', protegerRuta, crearPropiedadAdministradorPost)

export default router
