import express from 'express'
import { registro, login, olvideContraseña, crearUsuario, confirmar, resetearPassword, reestablecerPassword, nuevaContraseña, iniciarSesion, panelVendedor, panelComprador, editarPerfil, actualizarPerfil } from '../controllers/usuarioControllers.js'
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


// Editar perfil
router.get('/editar-perfil', protegerRuta, editarPerfil)
router.post('/editar-perfil', protegerRuta, actualizarPerfil)

export default router
