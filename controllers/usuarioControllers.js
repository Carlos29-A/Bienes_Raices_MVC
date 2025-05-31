import { validationResult, check } from "express-validator"
import { render } from "pug"

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

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        res.render('usuario/registro', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body
        })
    }

    return render('usuario/registro', {
        csrfToken: req.csrfToken(),
        errores: errores.array(),
        oldData: req.body
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
    login,
    olvideContraseña
}