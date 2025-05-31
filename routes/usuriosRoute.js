import express from 'express'
import { registro, login, olvideContraseña, crearUsuario, confirmar } from '../controllers/usuarioControllers.js'

const router = express.Router()


router.get('/registro', registro)
router.post('/registro', crearUsuario)
router.get('/confirmar/:token', confirmar)


router.get('/login', login)
router.get('/olvide-password', olvideContraseña)

export default router
