import { validationResult, check } from "express-validator"
import { render } from "pug"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/token.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"
const registro = (req, res) => {
    res.render('usuario/registro', {
        csrfToken: req.csrfToken()
    })
}
const crearUsuario = async (req, res) => {


    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)


    const { nombre, apellido, email, telefono, edad, password, tipo } = req.body
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        res.render('usuario/registro', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body
        })
    }
    // Verificar que el gmail no este registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    if (usuarioExistente) {
        return res.render('usuario/registro', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico ya está registrado' }],
            oldData: req.body
        })
    }

    const usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        telefono,
        edad,
        password,
        tipo,
        token: generarId(),
        confirmado: false
    })

    // Enviar el correo de confirmación
    emailRegistro({
        nombre,
        email,
        token: usuario.token
    })
    // Mostrar el mensaje de que se registro correctamente
    res.render('plantillas/mensaje', {
        titulo: 'Cuenta creada correctamente',
        mensaje: 'Tu cuenta ha sido creada correctamente, se te ha enviado un correo de confirmación',
        tipo: 'exito'
    })
}
const confirmar = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { token: req.params.token } })
    if (!usuario) {
        return res.render('plantillas/mensaje', {
            titulo: 'Token inválido',
            mensaje: 'Tu token no es válido, por favor solicita un nuevo correo de confirmación',
            tipo: 'error'
        })
    }
    usuario.confirmado = true
    usuario.token = null
    await usuario.save()
    res.render('plantillas/mensaje', {
        titulo: 'Cuenta confirmada correctamente',
        mensaje: 'Tu cuenta ha sido confirmada correctamente, ya puedes iniciar sesión',
        tipo: 'exito'
    })

}
const login = (req, res) => {
    res.render('usuario/login')
}
const olvideContraseña = (req, res) => {
    res.render('usuario/olvide-contraseña')
}

export {
    registro,
    crearUsuario,
    confirmar,
    login,
    olvideContraseña
}