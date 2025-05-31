import express from 'express'
import { registro, login, olvideContraseña, crearUsuario } from '../controllers/usuarioControllers.js'

const router = express.Router()


router.get('/login', login)
router.get('/registro', registro)
router.post('/registro', crearUsuario)
router.get('/olvide-password', olvideContraseña)

export default router
