import { validationResult, check } from "express-validator"
import { Usuario, Propiedad, Categoria, Favorito, Mensaje } from "../models/index.js"
import { generarId, generarJWT } from "../helpers/token.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"
import bcrypt from "bcrypt"
import { Op } from "sequelize"
import cookieParser from "cookie-parser"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const registro = (req, res) => {
    res.render('usuario/registro', {
        csrfToken: req.csrfToken(),
        pagina: 'Registro'
    })
}
const crearUsuario = async (req, res) => {

    // Validar nombre
    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener numeros').run(req)
    // Validar apellido
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('apellido').not().matches(/[0-9]/).withMessage('El apellido no puede contener numeros').run(req)
    // Validar email
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    // Validar telefono
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('telefono').isNumeric().withMessage('El telefono debe ser un numero').run(req)
    await check('telefono').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').run(req)
    await check('telefono').matches(/^9[0-9]{8}$/).withMessage('El telefono debe ser de Perú').run(req)
    // Validar edad
    await check('edad').isInt({ min: 23, max: 80 }).withMessage('La edad debe ser mayor a 23 años y menor a 80 años').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('edad').isNumeric().withMessage('La edad debe ser un numero').run(req)
    // Validar contraseña
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req)
    // Validar contraseña2
    await check('password2').notEmpty().withMessage('La contraseña de confirmación es requerida').run(req)
    await check('password2').isLength({ min: 8 }).withMessage('La contraseña de confirmación debe tener al menos 8 caracteres').run(req)
    // Validar que las contraseñas coincidan
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
    // Validar tipo
    await check('tipo').notEmpty().withMessage('El tipo de usuario es requerido').run(req)
    


    // Borrar los espacios en blanco
    req.body.nombre = req.body.nombre.trim()
    req.body.apellido = req.body.apellido.trim()
    req.body.email = req.body.email.trim()
    req.body.telefono = req.body.telefono.trim()
    req.body.password = req.body.password.trim()
    req.body.password2 = req.body.password2.trim()


    const { nombre, apellido, email, telefono, edad, password, tipo } = req.body
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/registro', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            pagina: 'Registro'
        })
    }
    // Verificar que el gmail no este registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    if (usuarioExistente) {
        return res.render('usuario/registro', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico ya está registrado', path: 'email' }],
            oldData: req.body,
            pagina: 'Registro'
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
        tipo: 'exito',
        pagina: 'Registro'
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
        csrfToken: req.csrfToken(),
        pagina: 'Olvide Contraseña'
    })
}
const resetearPassword = async (req, res) => {

    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)

    const errores = validationResult(req)
    // Si hay errores
    if (!errores.isEmpty()) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            pagina: 'Olvide Contraseña'
        })
    }
    const { email } = req.body
    // Buscar al usuario por el email
    const usuario = await Usuario.findOne({ where: { email } })
    
    // Si el usuario no existe
    if (!usuario) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico no está registrado', path: 'email' }],
            oldData: req.body,
            pagina: 'Olvide Contraseña'
        })
    }
    // Si la cuenta no esta confirmada
    if (usuario.confirmado === false) {
        return res.render('usuario/olvide-contraseña', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no está confirmada', path: 'email' }],
            oldData: req.body,
            pagina: 'Olvide Contraseña'
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
        tipo: 'exito',
        pagina: 'Olvide Contraseña'
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
        csrfToken: req.csrfToken(),
        pagina: 'Iniciar Sesión'
    })
}
const iniciarSesion = async (req, res) => {

    // Validar email
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    // Validar contraseña
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req)
    // Validar si hay errores
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            pagina: 'Iniciar Sesión'
        })
    }
    const { email, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico no está registrado', path: 'email' }],
            pagina: 'Iniciar Sesión'
        })
    }
    // Verificar si la cuenta esta confirmada
    if (!usuario.confirmado) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no está confirmada', path: 'email' }],
            pagina: 'Iniciar Sesión'
        })
    }
    // Comparar la contraseña
    const passwordCorrecto = await usuario.verificarPassword(password)
    if (!passwordCorrecto) {
        return res.render('usuario/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta', path: 'password' }],
            pagina: 'Iniciar Sesión'
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
    else if (usuario.tipo.toString() === '3') {
        //Almacenamos en el cookie el token
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/auth/administrador/panel')
    }
}

const cerrarSesion = (req, res) => {
    res.clearCookie('_token')
    res.redirect('/auth/login')
}

const panelVendedor = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })
    
    if(!usuario){
        return res.redirect('/auth/login')
    }
    
    const propiedades = await Propiedad.findAll({ where: { usuarioId: req.usuario.id } })
    const propiedadesPublicadas = propiedades.filter(propiedad => propiedad.publicado === true)
    
    // Mensajes recibidos
    const mensajes = await Mensaje.findAll({
        where : {
            destinatarioId : req.usuario.id
        },
        include : [
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'apellido']
            },
        ]
    })
    const mensajesRespondidos = await Mensaje.findAll({
        where : {
            remitenteId : req.usuario.id
        }
    })

    res.render('usuario/panel-vendedor', {
        titulo: 'Panel de Vendedor',
        propiedades,
        usuario,
        propiedadesPublicadas,
        mensajes,
        mensajesRespondidos,
        ruta: '/auth/vendedor/panel',
        pagina: 'Panel de Vendedor'
    })
}

const panelComprador = async (req, res) => {

    const { id } = req.usuario
    const usuario = await Usuario.findOne({ where: { id } })

    const categorias = await Categoria.findAll()

    // Propiedades favoritas
    const propiedadesFavoritas = await Favorito.findAll({
        where:{
            usuarioId : id
        },
        include : [
            {
                model : Propiedad,
                as : "propiedadRelacion",
                include : [
                    {
                        model : Categoria,
                        as : "categoriaRelacion"
                    }
                ]
            }
        ]
    })

    // Propiedades
    const propiedades = await Propiedad.findAll({
        where : {
            publicado : true
        },
        include : [
            {
                model : Categoria,
                as : "categoriaRelacion"
            }
        ]        

    })
    // Mensajes
    const mensajes = await Mensaje.findAll({
        where : {   
            remitenteId : id
        },
    })

    res.render('usuario/panel-comprador', {
        titulo: 'Panel de Comprador',
        usuario,
        propiedades,
        propiedadesFavoritas,
        mensajes,
        categorias,
        favoritos: propiedadesFavoritas,
        csrfToken: req.csrfToken(),
        ruta: '/auth/comprador/panel'
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
        errores: [],
        erroresPassword: [],
        csrfToken: req.csrfToken(),
        ruta: '/auth/editar-perfil',
        pagina: 'Editar Perfil'
    })
}
const actualizarPerfil = async (req, res) => {
    // Validar nombre
    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener numeros').run(req)
    // Validar apellido
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('apellido').not().matches(/[0-9]/).withMessage('El apellido no puede contener numeros').run(req)
    // Validar email
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    // Validar telefono
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('telefono').isNumeric().withMessage('El telefono debe ser un numero').run(req)
    await check('telefono').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').run(req)
    await check('telefono').matches(/^9[0-9]{8}$/).withMessage('El telefono debe ser de Perú').run(req)
    // Validar edad
    await check('edad').isInt({ min: 23, max: 80 }).withMessage('La edad debe ser mayor a 23 años y menor a 80 años').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('edad').isNumeric().withMessage('La edad debe ser un numero').run(req)

    // Solo validar contraseñas si se están enviando
    if (req.body.password_actual || req.body.password_nueva || req.body.password_confirmar) {
        await check('password_actual').notEmpty().withMessage('La contraseña actual es requerida').run(req)
        await check('password_nueva').notEmpty().withMessage('La contraseña nueva es requerida').run(req)
        await check('password_confirmar').notEmpty().withMessage('La contraseña de confirmación es requerida').run(req)
        await check('password_confirmar').equals(req.body.password_nueva).withMessage('Las contraseñas no coinciden').run(req)
    }

    // Borrar los espacios en blanco
    req.body.nombre = req.body.nombre.trim()
    req.body.apellido = req.body.apellido.trim()
    req.body.email = req.body.email.trim()
    req.body.telefono = req.body.telefono.trim()

    const errores = validationResult(req)
    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })

    // Separar errores de información personal y contraseña
    const erroresInfo = errores.array().filter(error => 
        !['password_actual', 'password_nueva', 'password_confirmar'].includes(error.path)
    )
    const erroresPassword = errores.array().filter(error => 
        ['password_actual', 'password_nueva', 'password_confirmar'].includes(error.path)
    )

    if (!errores.isEmpty()) {
        return res.render('usuario/editar-perfil', {
            csrfToken: req.csrfToken(),
            errores: erroresInfo,
            erroresPassword: erroresPassword,
            oldData: req.body,
            usuario,
            ruta: '/auth/editar-perfil',
            pagina: 'Editar Perfil'
        })
    }
    // Si quiere cambiar la contraseña
    if (req.body.password_actual) {
        const passwordCorrecto = await usuario.verificarPassword(req.body.password_actual)
        if (!passwordCorrecto) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                errores: [],
                erroresPassword: [{ msg: 'La contraseña actual es incorrecta', path: 'password_actual' }],
                usuario,
                ruta: '/auth/editar-perfil',
                pagina: 'Editar Perfil'
            })
        }
        if (req.body.password_nueva === req.body.password_actual) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                errores: [],
                erroresPassword: [{ msg: 'La contraseña nueva no puede ser igual a la contraseña actual', path: 'password_nueva' }],
                usuario,
                ruta: '/auth/editar-perfil',
                pagina: 'Editar Perfil'
            })
        }
        usuario.password = await bcrypt.hash(req.body.password_nueva, 10)
        await usuario.save()
        req.flash('mensajeFlash',   'Contraseña actualizada correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect('/auth/editar-perfil')
    }


    const { nombre, apellido, email, telefono, edad } = req.body
    usuario.nombre = nombre
    usuario.apellido = apellido
    usuario.email = email
    usuario.telefono = telefono
    usuario.edad = edad
    await usuario.save()
    req.flash('mensajeFlash', 'Perfil actualizado correctamente')
    req.flash('tipoFlash', 'exito')
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
        favoritos,
        ruta: '/auth/comprador/buscar-propiedades'
    })
}

const misPropiedades = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })
    const categorias = await Categoria.findAll()

    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: req.usuario.id
        },
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']
            }
        ]
    })

    res.render('propiedades/misPropiedades', {
        propiedades,
        usuario,
        categorias,
        csrfToken: req.csrfToken(),
        ruta: '/propiedades/mis-propiedades'
    })
}

const perfilUsuario = async (req, res) => {

    const { id } = req.params

    // Buscar al usuario
    const usuario = await Usuario.findByPk(id)

    // Si no existe el usuario, redirigir a la pagina de inicio
    if(!usuario){
        return res.redirect('/auth/login')
    }
    // Buscar las propiedades del usuario
    const propiedades = await Propiedad.findAll({ where: { usuarioId: id },
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']
            }
        ] })

    res.render('usuario/perfil', {
        usuario,
        propiedades,
        csrfToken: req.csrfToken()
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
    buscarPropiedades,
    misPropiedades,
    perfilUsuario
}