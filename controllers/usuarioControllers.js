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
        ruta: '/auth/vendedor/panel'
    })
}

const panelComprador = async (req, res) => {

    const { id } = req.usuario
    const usuario = await Usuario.findOne({ where: { id } })

    const categorias = await Categoria.findAll()
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
        },
        include : [
            {
                model : Categoria,
                as : "categoriaRelacion"
            }
        ]        

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
        categorias,
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
                limit: 10,
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
    const usuarios = await Usuario.findAll({where: {tipo: { [Op.or]: [1, 2] }}})
    // Compradores
    const compradores = await Usuario.findAll({ limit: 4, order: [['createdAt', 'DESC']], where: { tipo: 2 } })
    // Vendedores
    const vendedores = await Usuario.findAll({ limit: 4, order: [['createdAt', 'DESC']], where: { tipo: 1 } })
    // Mensajes
    const mensajes = await Mensaje.findAll()

    res.render('usuario/Administrador/panel-administrador', {
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

    const {tipo, estado} = req.query

    // Creamos un objeto para almacenar los filtros
    let filtro = {
        tipo: { [Op.or]: [1,2]},
    }

    if(tipo){
        filtro.tipo = parseInt(tipo)
    }
    if(estado){
        filtro.confirmado = parseInt(estado)
    }

    const usuarios = await Usuario.findAll({where: filtro})
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()
    

    
    res.render('usuario/Administrador/Administrador-Usuarios', {
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
    
    res.render('usuario/Administrador/Administrador-Propiedades', {
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

    res.render('usuario/Administrador/Administrador-Mensajes', {
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
    


    res.render('usuario/Administrador/Administrador-Perfil', {
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

    res.render('usuario/Administrador/Administrador-Usuarios-Crear', {
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
        return res.render('usuario/Administrador/Administrador-Usuarios-Crear', {
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
    
    req.flash('mensajeFlash', 'Usuario creado correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/administrador/usuarios')
}

const eliminarUsuarioAdministrador = async (req, res) => {

    const {id} = req.params
    const usuario = await Usuario.findByPk(id)
    
    if(!usuario){
        return res.redirect('/auth/administrador/usuarios')
    }
    // Eliminar las propiedades del usuario
    await Propiedad.destroy({ where: { usuarioId: id } })
    // Eliminar los mensajes del usuario
    await Mensaje.destroy({ where: { remitenteId: id } })
    await Mensaje.destroy({ where: { destinatarioId: id } })
    // Eliminar los favoritos del usuario
    await Favorito.destroy({ where: { usuarioId: id } })
    // Eliminar el usuario
    await usuario.destroy()

    req.flash('mensajeFlash', 'Usuario eliminado correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/administrador/usuarios')
}
const eliminarPropiedadAdministrador = async (req, res) => {

    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/auth/administrador/propiedades')
    }
    // Eliminar las imagenes de la propiedad que se guardan en la carpeta public/uploads
    const rutaImagen = path.join(__dirname, '../public/uploads', propiedad.imagen)
    if(fs.existsSync(rutaImagen)){
        fs.unlinkSync(rutaImagen)
    }
    // Eliminar los mensajes de la propiedad
    await Mensaje.destroy({ where: { propiedadId: id } })
    // Eliminar los favoritos de la propiedad
    await Favorito.destroy({ where: { propiedadId: id } })
    // Eliminar la propiedad
    await propiedad.destroy()
    req.flash('mensajeFlash', 'Propiedad eliminada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/administrador/propiedades')
}

const crearPropiedadAdministrador = async (req, res) => {

    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })

    if(!usuario){
        return res.redirect('/auth/login')
    }

    const usuarios = await Usuario.findAll({ where: { tipo: 1 } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()

    res.render('usuario/Administrador/crearPropiedad-Admin', {
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

    await check('titulo').notEmpty().withMessage('El titulo es requerido').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es requerida').run(req)
    await check('precio').notEmpty().withMessage('El precio es requerido').run(req)
    await check('habitaciones').notEmpty().withMessage('Las habitaciones son requeridas').run(req)
    await check('wc').notEmpty().withMessage('Los baños son requeridos').run(req)
    await check('estacionamiento').notEmpty().withMessage('El estacionamiento es requerido').run(req)
    await check('usuario').notEmpty().withMessage('El usuario es requerido').run(req)
    await check('categoria').notEmpty().withMessage('La categoría es requerida').run(req)
    await check('calle').notEmpty().withMessage('La calle es requerida').run(req)
    await check('lat').notEmpty().withMessage('La latitud es requerida').run(req)
    await check('lng').notEmpty().withMessage('La longitud es requerida').run(req)

    const errores = validationResult(req)

    const usuarios = await Usuario.findAll({ where: { tipo: 1 } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()

    if (!errores.isEmpty()) {
        return res.render('usuario/Administrador/crearPropiedad-Admin', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            usuario: req.usuario,
            usuarios,
            propiedades,
            mensajes,
            oldInfo : req.body
        })
    }

    const {titulo, descripcion, precio, habitaciones, wc, estacionamiento, usuario: usuarioId, categoria: categoriaId, calle, lat, lng} = req.body

    try{
        const propiedad = await Propiedad.create({
            titulo, descripcion, precio, habitaciones, wc, estacionamiento, usuarioId, categoriaId, calle, lat, lng})
        
        const {id} = propiedad

        res.redirect(`/auth/administrador/propiedades/agregar-imagen/${id}`)

    }catch(error){
        console.log(error)
    }

    

}
const agregarImagenAdministradorPropiedad = async (req, res) => {

    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const propiedades = await Propiedad.findAll()
    const mensajes = await Mensaje.findAll()

    if (!propiedad) {
        return res.redirect('/auth/administrador/propiedades')
    }


    if (propiedad.publicado === true) {
        return res.redirect('/auth/administrador/propiedades')
    }

    res.render('usuario/Administrador/agregar-imagen', {
        titulo: 'Agregar Imagen',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        propiedad,
        usuarios,
        propiedades,
        mensajes
    })
}


const subirImagenAdministradorPropiedad = async (req, res, next) => {

    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/auth/administrador/propiedades')
    }


    if(propiedad.publicado === true){
        return res.redirect('/auth/administrador/propiedades')
    }

    try{

        // Verificar que se subió un archivo
        if (!req.file) {
            console.log('No se subió ningún archivo')
            return res.redirect(`/propiedades/agregar-imagen/${id}`)
        }

        // Almacenar la imagen en la base de datos
        propiedad.imagen = req.file.filename
        propiedad.publicado = true
        await propiedad.save()
        next()
    }catch(error){
        console.log(error)
    }

}

const panelAdministradorCategorias = async (req, res) => {
    const categorias = await Categoria.findAll()
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const mensajes = await Mensaje.findAll()



    res.render('usuario/Administrador/Administrador-Categorias', {
        titulo: 'Panel de Administrador de Categorías',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        categorias,
        usuarios,
        mensajes
    })
}

const crearCategoriaAdministrador = async (req, res) => {
    const categorias = await Categoria.findAll()
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const mensajes = await Mensaje.findAll()

    res.render('usuario/Administrador/Administrador-Categorias-Crear', {
        titulo: 'Crear Categoría',
        csrfToken: req.csrfToken(),
        categorias,
        usuario: req.usuario,
        usuarios,
        mensajes,
        oldData: req.body
    })
}

const crearCategoriaAdministradorPost = async (req, res) => {

    const categorias = await Categoria.findAll()
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const mensajes = await Mensaje.findAll()

    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es requerida').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {

        return res.render('usuario/Administrador/Administrador-Categorias-Crear', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            categorias,
            usuario: req.usuario,
            usuarios,
            mensajes,
            datos: req.body
        })
    }

    const {nombre, descripcion} = req.body

    try{

        const categoria = await Categoria.create({nombre, descripcion})
        req.flash('mensajeFlash', 'Categoría creada correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect('/auth/administrador/categorias')

    }catch(error){
        console.log(error)
    }

}

const eliminarCategoriaAdministrador = async (req, res) => {

    const {id} = req.params
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/auth/administrador/categorias')
    }
    // Eliminar las propiedades de la categoria
    await Propiedad.destroy({ where: { categoriaId: id } })
    // Eliminar la categoria
    await categoria.destroy()
    
    req.flash('mensajeFlash', 'Categoría eliminada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/administrador/categorias')
}

const editarCategoriaAdministrador = async (req, res) => {

    const {id} = req.params
    const categoria = await Categoria.findByPk(id)
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    const mensajes = await Mensaje.findAll()

    if(!categoria){
        return res.redirect('/auth/administrador/categorias')
    }

    res.render('usuario/Administrador/Administrador-Categorias-Editar', {
        titulo: 'Editar Categoría',
        descripcion: 'Edita la categoría seleccionada',
        csrfToken: req.csrfToken(),
        categoria,
        usuario: req.usuario,
        usuarios,
        mensajes,
    })
}

const editarCategoriaAdministradorPost = async (req, res) => {

    const {id} = req.params
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/auth/administrador/categorias')
    }

    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es requerida').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/Administrador/Administrador-Categorias-Editar', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            categoria,
            usuario: req.usuario,
            usuarios,
            mensajes,
        })
    }

    const {nombre, descripcion} = req.body
    try{
        categoria.nombre = nombre
        categoria.descripcion = descripcion
        await categoria.save()
    }catch(error){
        console.log(error)
    }

    req.flash('mensajeFlash', 'Categoría actualizada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/administrador/categorias')
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
    panelAdministrador,
    panelAdministradorUsuarios,
    panelAdministradorPropiedades,
    panelAdministradorMensajes,
    panelAdministradorPerfil,
    crearUsuarioAdministrador,
    crearUsuarioAdministradorPost,
    eliminarUsuarioAdministrador,
    eliminarPropiedadAdministrador,
    crearPropiedadAdministrador,
    crearPropiedadAdministradorPost,
    crearCategoriaAdministrador,
    crearCategoriaAdministradorPost,
    panelAdministradorCategorias,
    eliminarCategoriaAdministrador,
    editarCategoriaAdministrador,
    editarCategoriaAdministradorPost,
    misPropiedades,
    agregarImagenAdministradorPropiedad,
    subirImagenAdministradorPropiedad,
    perfilUsuario
}