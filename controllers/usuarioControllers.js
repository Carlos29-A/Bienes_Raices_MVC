import { validationResult, check } from "express-validator"
import { Usuario, Propiedad, Categoria, Favorito, Mensaje } from "../models/index.js"
import { generarId, generarJWT } from "../helpers/token.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"
import bcrypt from "bcrypt"
import { Op } from "sequelize"
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

    res.render('usuario/panel-vendedor', {
        titulo: 'Panel de Vendedor',
        propiedades,
        usuario,
        propiedadesPublicadas,
        mensajes,
        ruta: '/auth/vendedor/panel'
    })
}

const panelComprador = async (req, res) => {

    const { id } = req.usuario
    const usuario = await Usuario.findOne({ where: { id } })

    // propiedades favoritas
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

    const propiedades = await Propiedad.findAll({
        where : {
            publicado : true
        }
    })
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
        csrfToken: req.csrfToken(),
        ruta: '/auth/editar-perfil'
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
            usuario,
            ruta: '/auth/editar-perfil'
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
                usuario,
                ruta: '/auth/editar-perfil'
            })
        }
        const passwordCorrecto = await usuario.verificarPassword(req.body.password_actual)
        if (!passwordCorrecto) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'La contraseña actual es incorrecta' }],
                usuario,
                ruta: '/auth/editar-perfil'
            })
        }
        if (req.body.password_nueva !== req.body.password_confirmar) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'Las contraseñas no coinciden' }],
                usuario,
                ruta: '/auth/editar-perfil'
            })
        }
        if (req.body.password_nueva === req.body.password_actual) {
            return res.render('usuario/editar-perfil', {
                csrfToken: req.csrfToken(),
                erroresPassword: [{ msg: 'La contraseña nueva no puede ser igual a la contraseña actual' }],
                usuario,
                ruta: '/auth/editar-perfil'
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
        favoritos,
        ruta: '/auth/comprador/buscar-propiedades'
    })
}


// Panel de administrador
const panelAdministrador = async (req, res) => {

    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }
    
    // Propiedades
    const [propiedades, propiedadesActivas] = await Promise.all([
        Propiedad.findAll(
            {
                include:[
                {
                    model: Categoria,
                    as: 'categoriaRelacion'
                },
                {
                    model: Usuario,
                    as: 'usuarioRelacion'
                }
            ]
        }
    ),
    Propiedad.count({ where: { publicado: true } })
    ])
    // Usuarios
    const usuarios = await Usuario.findAll()
    // Compradores
    const compradores = await Usuario.findAll({ where: { tipo: 2 } })
    // Vendedores
    const vendedores = await Usuario.findAll({ where: { tipo: 1 } })
    // Mensajes
    const mensajes = await Mensaje.findAll()

    res.render('usuario/panel-administrador', {
        titulo: 'Panel de Administrador',
        usuario: req.usuario,
        propiedades,
        usuarios,
        compradores,
        vendedores,
        mensajes,
        propiedadesActivas
    })
}

const panelAdministradorUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()
    

    
    res.render('usuario/Administrador-Usuarios', {
        titulo: 'Panel de Administrador de Usuarios',
        usuario: req.usuario,
        usuarios,
        csrfToken: req.csrfToken(),
        propiedades,
        mensajes
    })
}
const panelAdministradorPropiedades = async (req, res) => {
    
    const propiedades = await Propiedad.findAll({
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']
            },
            {
                model: Usuario,
                as: 'usuarioRelacion',
                attributes: ['nombre', 'email']
            }
        ]
    })
    const mensajes = await Mensaje.findAll()
    const usuarios = await Usuario.findAll({where: {tipo: { [Op.or]: [1, 2] }}})
    
    res.render('usuario/Administrador-Propiedades', {
        titulo: 'Panel de Administrador de Propiedades',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        propiedades,
        mensajes,
        usuarios
    })
}
const panelAdministradorMensajes = async (req, res) => {

    const mensajes = await Mensaje.findAll(
        {
            include: [
                {
                    model: Usuario,
                    as: 'remitenteRelacion'
                },
                {
                    model: Usuario,
                    as: 'destinatarioRelacion'
                },
                {
                    model: Propiedad,
                    as: 'propiedadRelacion'
                }
            ]
        }

    )
    const usuarios = await Usuario.findAll({where: {tipo: { [Op.or]: [1, 2] }}})
    const propiedades = await Propiedad.findAll()

    res.render('usuario/Administrador-Mensajes', {
        titulo: 'Panel de Administrador de Mensajes',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        mensajes,
        usuarios,
        propiedades
    })
}
const panelAdministradorPerfil = async (req, res) => {

    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    const mensajes = await Mensaje.findAll()
    const usuarios = await Usuario.findAll({where: {tipo: { [Op.or]: [1, 2] }}})
    const propiedades = await Propiedad.findAll()
    


    res.render('usuario/Administrador-Perfil', {
        titulo: 'Panel de Administrador de Perfil',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        mensajes,
        usuarios,
        propiedades,
        administrador
    })
}

const crearUsuarioAdministrador = async (req, res) => {
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()

    res.render('usuario/Administrador-Usuarios-Crear', {
        titulo: 'Crear Usuario Administrador',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        usuarios,
        propiedades,
        mensajes,
        oldData : req.body
    })
}

const crearUsuarioAdministradorPost = async (req, res) => {

    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })

    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()


    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('tipo').notEmpty().withMessage('El tipo es requerido').run(req)
    await check('confirmado').notEmpty().withMessage('La confirmación es requerida').run(req)

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.render('usuario/Administrador-Usuarios-Crear', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            usuarios,
            propiedades,
            mensajes,
            usuario,
            oldData : req.body
            
        })
    }
    const {nombre, apellido, email, telefono, password, tipo, edad, confirmado} = req.body
    const usuarioCreado = await Usuario.create({nombre, apellido, email, telefono, password, tipo, edad, confirmado})
    res.render('plantillas/mensajeAdministrador', {
        titulo: 'El administrador creó un usuario nuevo',
        mensaje: 'El administrador ha creado un usuario nuevo correctamente',
        tipo: 'exito',
        usuarios,
        propiedades,
        mensajes,
    })
}

const crearPropiedadAdministrador = async (req, res) => {

    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })

    if(!usuario){
        return res.redirect('/auth/login')
    }

    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()

    res.render('propiedades/crearPropiedad-Admin', {
        titulo: 'Crear Propiedad',
        usuario,
        csrfToken: req.csrfToken(),
        usuarios,
        propiedades,
        mensajes,
        oldInfo : []
    })
}
const crearPropiedadAdministradorPost = async (req, res) => {

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
    panelAdministrador,
    panelAdministradorUsuarios,
    panelAdministradorPropiedades,
    panelAdministradorMensajes,
    panelAdministradorPerfil,
    crearUsuarioAdministrador,
    crearUsuarioAdministradorPost,
    crearPropiedadAdministrador,
    crearPropiedadAdministradorPost,
    misPropiedades
}