import { validationResult, check } from "express-validator"
import { Usuario, Propiedad, Categoria, Favorito } from "../models/index.js"
import { generarId, generarJWT } from "../helpers/token.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
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
        return res.render('usuario/registro', {
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
const olvideContraseña = (req, res) => {
    res.render('usuario/olvide-contraseña', {
        csrfToken: req.csrfToken()
    })
}
const resetearPassword = async (req, res) => {

    await check('email').notEmpty().withMessage('El email es requerido').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body
        })
    }
    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico no está registrado' }],
            oldData: req.body
        })
    }
    if (usuario.confirmado === false) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no está confirmada' }],
            oldData: req.body
        })
    }
    usuario.token = generarId()
    await usuario.save()
    // Enviar el correo de restablecimiento de contraseña
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    res.render('plantillas/mensaje', {
        titulo: 'Correo enviado correctamente',
        mensaje: 'Se ha enviado un correo para restablecer tu contraseña',
        tipo: 'exito'
    })
}

const reestablecerPassword = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { token: req.params.token } })
    if (!usuario) {
        return res.render('plantillas/mensaje', {
            titulo: 'Token inválido',
            mensaje: 'Tu token no es válido, por favor solicita un nuevo correo de restablecimiento de contraseña',
            tipo: 'error'
        })
    }
    if (usuario.confirmado === false) {
        return res.render('plantillas/mensaje', {
            titulo: 'Cuenta no confirmada',
            mensaje: 'Tu cuenta no está confirmada, por favor confirma tu cuenta',
            tipo: 'error'
        })
    }
    res.render('usuario/reestablecer-password', {
        csrfToken: req.csrfToken(),
        token: req.params.token
    })
}

const nuevaContraseña = async (req, res) => {

    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/reestablecer-password', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
        })
    }
    const { password } = req.body

    const usuario = await Usuario.findOne({ where: { token: req.params.token } })
    if (!usuario) {
        return res.render('plantillas/mensaje', {
            titulo: 'Token inválido',
            mensaje: 'Tu token no es válido, por favor solicita un nuevo correo de restablecimiento de contraseña',
            tipo: 'error'
        })
    }
    usuario.password = await bcrypt.hash(password, 10)
    usuario.token = null
    await usuario.save()
    res.render('plantillas/mensaje', {
        titulo: 'Contraseña restablecida correctamente',
        mensaje: 'Tu contraseña ha sido restablecida correctamente, ya puedes iniciar sesión',
        tipo: 'exito',
    })
}
const login = (req, res) => {
    res.render('usuario/login', {
        csrfToken: req.csrfToken()
    })
}
const iniciarSesion = async (req, res) => {
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
        })
    }
    const { email, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico no está registrado' }],
        })
    }
    // Verificar si la cuenta esta confirmada
    if (!usuario.confirmado) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no está confirmada' }],
        })
    }
    // Comparar la contraseña
    const passwordCorrecto = await usuario.verificarPassword(password)
    if (!passwordCorrecto) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta' }],
        })
    }

    // Generar un JWT
    const token = generarJWT({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo
    })

    if (usuario.tipo.toString() === '1') {
        //Almacenamoe en el cookie el token
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/auth/vendedor/panel')
    }
    else if (usuario.tipo.toString() === '2') {
        //Almacenamos en el cookie el token
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/auth/comprador/panel')
    }
}

const cerrarSesion = (req, res) => {
    res.clearCookie('_token')
    res.redirect('/auth/login')
}

const panelVendedor = async (req, res) => {

    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })
    const propiedades = await Propiedad.findAll({ where: { usuarioId: req.usuario.id } })
    const propiedadesPublicadas = propiedades.filter(propiedad => propiedad.publicado === true)

    console.log(propiedades.length)


    res.render('usuario/panel-vendedor', {
        titulo: 'Panel de Vendedor',
        propiedades,
        usuario,
        propiedadesPublicadas
    })
}

const panelComprador = async (req, res) => {

    const { id } = req.usuario
    const usuario = await Usuario.findOne({ where: { id } })


    res.render('usuario/panel-comprador', {
        titulo: 'Panel de Comprador',
        usuario
    })
}

const editarPerfil = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })
    if (!usuario) {
        return res.redirect('/auth/login')
    }
    res.render('usuario/editar-perfil', {
        titulo: 'Editar Perfil',
        usuario,
        csrfToken: req.csrfToken()
    })
}
const actualizarPerfil = async (req, res) => {

    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)

    const errores = validationResult(req)

    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })

    if (!errores.isEmpty()) {
        return res.render('usuario/editar-perfil', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            usuario
        })
    }
    // Si quiere cambiar la contraseña
    if (req.body.password_actual) {
        await check('password_nueva').notEmpty().withMessage('La contraseña nueva es requerida').run(req)
        await check('password_confirmar').equals(req.body.password_nueva).withMessage('Las contraseñas no coinciden').run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: errores.array(),
                usuario
            })
        }
        const passwordCorrecto = await usuario.verificarPassword(req.body.password_actual)
        if (!passwordCorrecto) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'La contraseña actual es incorrecta' }],
                usuario
            })
        }
        if (req.body.password_nueva !== req.body.password_confirmar) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'Las contraseñas no coinciden' }],
                usuario
            })
        }
        if (req.body.password_nueva === req.body.password_actual) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'La contraseña nueva no puede ser igual a la contraseña actual' }],
                usuario
            })
        }
        usuario.password = await bcrypt.hash(req.body.password_nueva, 10)
        await usuario.save()
        res.render('plantillas/mensaje', {
            titulo: 'Contraseña actualizada correctamente',
            mensaje: 'Tu contraseña ha sido actualizada correctamente',
            tipo: 'exito',
        })
    }


    const { nombre, apellido, email, telefono, edad } = req.body
    usuario.nombre = nombre
    usuario.apellido = apellido
    usuario.email = email
    usuario.telefono = telefono
    usuario.edad = edad
    await usuario.save()
    res.redirect('/auth/editar-perfil')
}

const buscarPropiedades = async (req, res) => {
    const propiedades = await Propiedad.findAll({
        where: {
            publicado: true
        },
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']
            },
            {
                model: Usuario,
                as: 'usuarioRelacion',
                attributes: ['nombre', 'apellido', 'id']
            }

        ]
    })
    const favoritos = await Favorito.findAll({
        where: {
            usuarioId: req.usuario.id
        },
        include: [
            {
                model: Propiedad,
                as: 'propiedadRelacion'
            }
        ]
    })

    res.render('propiedades/buscarPropiedades', {
        titulo: 'Buscar Propiedades',
        csrfToken: req.csrfToken(),
        propiedades,
        favoritos
    })
}
export {
    registro,
    crearUsuario,
    confirmar,
    olvideContraseña,
    resetearPassword,
    reestablecerPassword,
    nuevaContraseña,
    login,
    iniciarSesion,
    cerrarSesion,
    panelVendedor,
    panelComprador,
    editarPerfil,
    actualizarPerfil,
    buscarPropiedades
}