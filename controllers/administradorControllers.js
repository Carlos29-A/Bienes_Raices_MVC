import { Usuario, Propiedad, Categoria, Mensaje, Favorito } from '../models/index.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import { check, validationResult } from 'express-validator'
import { validarUsuarioAdministrador, validarPropiedad } from '../helpers/Validaciones.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Panel de administrador
const panelAdministrador = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador || administrador.tipo !== 3){
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
        propiedadesActivas,
        csrfToken: req.csrfToken(),
        pagina: 'Panel de Administrador'
    })
}

const panelAdministradorUsuarios = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    // Si no es administrador, redirigir a la página de login
    if(!administrador){
        return res.redirect('/auth/login')
    }

    // Recuperar los filtros
    const { tipo, estado, nombre, gmail } = req.query

    // Crear un objeto
    const filtro = {}

    if (tipo) filtro.tipo = tipo
    if (estado) filtro.confirmado = estado
    if (nombre) filtro.nombre = { [Op.like]: `%${nombre}%` }
    if (gmail) filtro.email = { [Op.like]: `%${gmail}%` }
    
    const usuarios = await Usuario.findAll({ where: filtro})

    res.render('usuario/Administrador/Administrador-Usuarios', {
        titulo: 'Administrar Usuarios',
        usuario: req.usuario,
        usuarios,
        csrfToken: req.csrfToken(),
        pagina: 'Administrar Usuarios'
    })
}

const panelAdministradorPropiedades = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    const propiedades = await Propiedad.findAll({
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion'
            },
            {
                model: Usuario,
                as: 'usuarioRelacion'
            }
        ]
    })

    res.render('usuario/Administrador/Administrador-Propiedades', {
        titulo: 'Administrar Propiedades',
        usuario: req.usuario,
        propiedades,
        csrfToken: req.csrfToken(),
        pagina: 'Administrar Propiedades'
    })
}

const panelAdministradorMensajes = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    const { estado, tipo } = req.query

    const filtro = {}

    if(estado) filtro.leido = estado
    if(tipo) filtro.tipo = tipo

    const mensajes = await Mensaje.findAll({
        where: filtro.estado === 'leido' ? { leido: true } : { leido: false },
        include: [
            {
                model: Usuario,
                as: 'remitenteRelacion',
                where: filtro.tipo === 'vendedor' ? { tipo: 1 } : { tipo: 2 }
            },
            {
                model: Usuario,
                as: 'destinatarioRelacion',
                where: filtro.tipo === 'vendedor' ? { tipo: 1 } : { tipo: 2 }
            },
            {
                model: Propiedad,
                as: 'propiedadRelacion',
                include: [
                    {
                        model: Categoria,
                        as: 'categoriaRelacion'
                    },
                ]
            }
        ]
    })

    res.render('usuario/Administrador/Administrador-Mensajes', {
        titulo: 'Administrar Mensajes',
        usuario: req.usuario,
        mensajes,
        csrfToken: req.csrfToken(),
        pagina: 'Administrar Mensajes',
    })
}

const panelAdministradorPerfil = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    res.render('usuario/Administrador/Administrador-Perfil', {
        titulo: 'Perfil de Administrador',
        usuario: administrador,
        csrfToken: req.csrfToken(),
        pagina: 'Perfil de Administrador',
    })
}

const editarPerfilAdministradorPost = async (req, res) => {
    const {id} = req.usuario
    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    // validar los datos
    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener numeros').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('apellido').not().matches(/[0-9]/).withMessage('El apellido no puede contener numeros').run(req)
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es válido').run(req)
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('telefono').isNumeric().withMessage('El telefono debe ser un numero').run(req)
    await check('telefono').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').run(req)
    await check('telefono').matches(/^9[0-9]{8}$/).withMessage('El telefono debe ser de Perú').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('edad').isInt({min: 23, max: 80}).withMessage('La edad debe ser entre 23 y 80 años').run(req)
    await check('edad').isNumeric().withMessage('La edad debe ser un numero').run(req)
    await check('password_actual').notEmpty().withMessage('La contraseña actual es requerida').run(req)
    await check('password_nueva').notEmpty().withMessage('La contraseña nueva es requerida').run(req)
    await check('password_confirmar').notEmpty().withMessage('La contraseña de confirmación es requerida').run(req)
    await check('password_confirmar').equals(req.body.password_nueva).withMessage('Las contraseñas no coinciden').run(req)
    await check('password_nueva').not().equals(req.body.password_actual).withMessage('La contraseña nueva no puede ser igual a la contraseña actual').run(req)

    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('usuario/Administrador/Administrador-Perfil', {
            titulo: 'Perfil de Administrador',
            usuario: administrador,
            errores: errores.array(),
            csrfToken: req.csrfToken(),
            pagina: 'Editar Perfil'
        })
    }

    const { nombre, apellido, email, telefono, edad, password_actual, password_nueva, password_confirmar } = req.body

    // validar que la contraseña actual sea correcta
    const passwordCorrecto = await bcrypt.compare(password_actual, administrador.password)

    if(!passwordCorrecto){
        return res.render('usuario/Administrador/Administrador-Perfil', {
            titulo: 'Perfil de Administrador',
            usuario: administrador,
            errores: [{ msg: 'La contraseña actual no es correcta', path: 'password_actual' }],
            csrfToken: req.csrfToken(),
            pagina: 'Editar Perfil'
        })
    }

    // validar que la contraseña nueva y la contraseña de confirmación sean iguales
    if(password_nueva !== password_confirmar){
        return res.render('usuario/Administrador/Administrador-Perfil', {
            titulo: 'Perfil de Administrador',
            usuario: administrador,
            errores: [{ msg: 'La contraseña nueva y la contraseña de confirmación no coinciden', path: 'password_confirmar' }],
            csrfToken: req.csrfToken(),
            pagina: 'Editar Perfil'
        })
    }

    // actualizar los datos del administrador
    administrador.nombre = nombre   
    administrador.apellido = apellido
    administrador.email = email
    administrador.telefono = telefono
    administrador.edad = edad
    administrador.password = await bcrypt.hash(password_nueva, 10)
    await administrador.save()

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Perfil actualizado correctamente')
    req.flash('tipoFlash', 'success')
    res.redirect('/auth/administrador/perfil')

}
// Acciones del administrador con respecto a los usuarios

const crearUsuarioAdministrador = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })
    // Usuarios
    const usuarios = await Usuario.findAll({where: {tipo: { [Op.or]: [1, 2] }}})
    // Propiedades
    const propiedades = await Propiedad.findAll()
    // Mensajes
    const mensajes = await Mensaje.findAll()
    // Categorias
    const categorias = await Categoria.findAll()
    if(!administrador){
        return res.redirect('/auth/login')
    }

    res.render('usuario/Administrador/Administrador-Usuarios-Crear', {
        titulo: 'Crear Usuario',
        usuario: req.usuario,
        usuarios,
        propiedades,
        mensajes,
        categorias,
        csrfToken: req.csrfToken(),
        pagina: 'Crear Usuario'
    })
}

const crearUsuarioAdministradorPost = async (req, res) => {

    // Validar los datos
    const errores = await validarUsuarioAdministrador(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/Administrador/Administrador-Usuarios-Crear', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            usuario: req.usuario,
            pagina: 'Crear Usuario'
        })
    }

    const { nombre, apellido, email, telefono, edad, password, tipo } = req.body

    const usuarioExistente = await Usuario.findOne({ where: { email } })

    if (usuarioExistente) {
        return res.render('usuario/Administrador/Administrador-Usuarios-Crear', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya existe' }],
            oldData: req.body,
            usuario: req.usuario,
            pagina: 'Crear Usuario'
        })
    }

    const usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        telefono,
        edad,
        password: await bcrypt.hash(password, 10),
        tipo: parseInt(tipo),
        confirmado: true
    })
    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Usuario creado correctamente')
    req.flash('tipoFlash', 'success')
    res.redirect('/auth/administrador/usuarios')
}

const editarUsuarioAdministrador = async (req, res) => {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.redirect('/auth/administrador/usuarios')
    }

    res.render('usuario/Administrador/Administrador-Usuarios-Editar', {
        titulo: 'Editar Usuario',
        usuario: req.usuario,
        usuarioEditar: usuario,
        csrfToken: req.csrfToken(),
        pagina: 'Editar Usuario'
    })
}
const editarUsuarioAdministradorPost = async (req, res) => {
    // Recoger al administrador
    const { id } = req.usuario
    const administrador = await Usuario.findByPk(id)

    // Si no es administrador, redirigir a la página de login
    if(!administrador){
        return res.redirect('/auth/login')
    }else{
        // Recoger al usuario a editar
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)
        // Validar los datos
        const errores = await validarUsuarioAdministrador(req)

        // SI hay errores, redirigir a la página de edición
        if(!errores.isEmpty()){
            return res.render('usuario/Administrador/Administrador-Usuarios-Editar', {
                titulo: 'Editar Usuario',
                usuario: administrador,
                usuarioEditar: usuario,
                errores: errores.array(),
                csrfToken: req.csrfToken()
            })
        }else{
            // Recoger los datos del formulario
            const { nombre, apellido, email, telefono, edad, tipo, confirmado } = req.body

            // Validar que el email no exista
            const usuarioExistente = await Usuario.findOne({ where: { email } })

            if(usuarioExistente && usuarioExistente.id !== usuario.id){
                return res.render('usuario/Administrador/Administrador-Usuarios-Editar', {
                    titulo: 'Editar Usuario',
                    usuario: administrador,
                    usuarioEditar: usuario,
                    errores: [{ msg: 'El usuario ya existe', path: 'email' }],
                    csrfToken: req.csrfToken()
                })
            }
            // Actualizar los datos del usuario
            try{
                usuario.nombre = nombre
                usuario.apellido = apellido
                usuario.email = email
                usuario.telefono = telefono
                usuario.edad = edad
                usuario.tipo = tipo
                usuario.confirmado = confirmado
                await usuario.save()
                // Enviar un mensaje con flash
                req.flash('mensajeFlash', 'Usuario actualizado correctamente')
                req.flash('tipoFlash', 'success')
                res.redirect('/auth/administrador/usuarios')
            }catch(error){
                console.log(error)
            }
        }
    }

}

const eliminarUsuarioAdministrador = async (req, res) => {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.redirect('/auth/administrador/usuarios')
    }

    // Eliminar las propiedades del usuario
    const propiedades = await Propiedad.findAll({ where: { usuarioId: id } })
    for (const propiedad of propiedades) {
        if (propiedad.imagen !== 'default.jpg') {
            fs.unlinkSync(path.join(__dirname, '../public/uploads/', propiedad.imagen))
        }
        await propiedad.destroy()
    }
    // Eliminar los mensajes del usuario
    const mensajes = await Mensaje.findAll({ where: { remitenteId: id } })
    for (const mensaje of mensajes) {
        await mensaje.destroy()
    }
    const mensajes2 = await Mensaje.findAll({ where: { destinatarioId: id } })
    for (const mensaje of mensajes2) {
        await mensaje.destroy()
    }
    // Eliminar el usuario
    await usuario.destroy()

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Usuario eliminado correctamente')
    req.flash('tipoFlash', 'error')

    res.redirect('/auth/administrador/usuarios')
}




// Acciones del administrador con respecto a las propiedades
const crearPropiedadAdministrador = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }
    // Vendedores
    const vendedores = await Usuario.findAll({where: {tipo: 1}})

    const categorias = await Categoria.findAll()

    res.render('usuario/Administrador/Administrador-Propiedades-Crear', {
        titulo: 'Crear Propiedad',
        usuario: req.usuario,
        usuarios : vendedores,
        categorias,
        csrfToken: req.csrfToken(),
        oldInfo: '',
        pagina: 'Crear Propiedad'
    })
}

const crearPropiedadAdministradorPost = async (req, res) => {
    const erroresValidacion = await validarPropiedad(req)

    const errores = erroresValidacion.array()
    // Validar si escogio un vendedor
    if(!req.body.usuario){
        // agregar un error
        errores.push({ msg: 'Debes seleccionar un vendedor', path: 'usuario' })
    }

    if (errores.length > 0) {
        const categorias = await Categoria.findAll()
        return res.render('usuario/Administrador/Administrador-Propiedades-Crear', {
            csrfToken: req.csrfToken(),
            errores: errores,
            oldInfo: req.body,
            usuario: req.usuario,
            categorias,
            pagina: 'Crear Propiedad'
        })
    }

    const { titulo, descripcion, categoria, precio, habitaciones, wc, estacionamiento, lat, lng, calle } = req.body

    const propiedad = await Propiedad.create({
        titulo,
        descripcion,
        precio: parseInt(precio),
        habitaciones: parseInt(habitaciones),
        wc: parseInt(wc),
        estacionamiento: parseInt(estacionamiento),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        calle,
        categoriaId: parseInt(categoria),
        usuarioId: req.usuario.id,
        imagen: req.file?.filename || 'default.jpg',
        publicado: true
    })
    // Recoger la id de la propiedad creada

    const {id} = propiedad

    // Redirigir a la página de agregar imagen
    res.redirect(`/auth/administrador/propiedades/agregar-imagen/${id}`)
}

const agregarImagenAdministradorPropiedad = async (req, res) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/administrador/propiedades')
    }

    res.render('usuario/Administrador/Administrador-Propiedades-AgregarImagen', {
        titulo: 'Agregar Imagen',
        usuario: req.usuario,
        propiedad,
        csrfToken: req.csrfToken(),
        pagina: 'Agregar Imagen'
    })
}

const subirImagenAdministradorPropiedad = async (req, res, next) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/administrador/propiedades')
    }

    if (!req.file) {
        return res.render('usuario/agregar-imagen', {
            titulo: 'Agregar Imagen',
            usuario: req.usuario,
            propiedad,
            errores: [{ msg: 'Debes subir una imagen' }],
            csrfToken: req.csrfToken()
        })
    }


    propiedad.imagen = req.file.filename
    propiedad.publicado = true
    await propiedad.save()
    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Propiedad publicada correctamente')
    req.flash('tipoFlash', 'success')
    next()
}

const editarPropiedadAdministrador = async (req, res) => {
    // Verificar si el usuario existe
    const { id } = req.usuario
    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }else{
        // Recoger la propiedad a editar
        const { id} = req.params
        await Propiedad.findByPk(id, { include : [
            {
                model: Categoria,
                as: 'categoriaRelacion'
            },
            {
                model: Usuario,
                as: 'usuarioRelacion'
            }
        ]}).then(propiedad => {
            if (!propiedad){
                return res.redirect('/auth/administrador/propiedades')
            }
            // Mostramos el formulario
            res.status(200).render('usuario/Administrador/Administrador-Propiedades-Editar', {
                titulo: 'Editar Propiedad',
                usuario: administrador,
                propiedad,
                csrfToken: req.csrfToken(),
                pagina: 'Editar Propiedad'
            })
            
        }).catch(error => {
            console.log(error)
        })
    }

}
const editarPropiedadAdministradorPost = async (req, res) => {

    try {
        // Verificar si el usuario existe
        const { id } = req.usuario
        const administrador = await Usuario.findOne({ where: { id } })

        if(!administrador){
            return res.redirect('/auth/login')
        }

        // Recoger la propiedad a editar
        const { id: propiedadId } = req.params
        const propiedad = await Propiedad.findByPk(propiedadId, { include : [
            {
                model: Categoria,
                as: 'categoriaRelacion'
            },
            {
                model: Usuario,
                as: 'usuarioRelacion'
            }
        ]})
        
        if(!propiedad){
            return res.redirect('/auth/administrador/propiedades')
        }

        // Validar los datos
        const erroresValidacion = await validarPropiedad(req)

        const errores = erroresValidacion.array()

        // Si hay errores, redirigir a la página de edición
        if(errores.length > 0){
            return res.render('usuario/Administrador/Administrador-Propiedades-Editar', {
                titulo: 'Editar Propiedad',
                usuario: req.usuario,
                propiedad,
                errores: errores,
                csrfToken: req.csrfToken(),
                pagina: 'Editar Propiedad'
            })
        }

        // Recoger los datos del formulario
        const { titulo, descripcion, categoria, precio, habitaciones, wc, estacionamiento, lat, lng, calle } = req.body

        // Actualizar los datos de la propiedad
        propiedad.titulo = titulo
        propiedad.descripcion = descripcion
        propiedad.precio = parseInt(precio)
        propiedad.habitaciones = parseInt(habitaciones)
        propiedad.wc = parseInt(wc)
        propiedad.estacionamiento = parseInt(estacionamiento)
        propiedad.categoriaId = parseInt(categoria)
        propiedad.calle = calle
        propiedad.lat = lat
        propiedad.lng = lng

        await propiedad.save()

        // Enviar un mensaje con flash
        req.flash('mensajeFlash', 'Propiedad actualizada correctamente')
        req.flash('tipoFlash', 'success')
        res.redirect('/auth/administrador/propiedades')

    } catch (error) {
        req.flash('mensajeFlash', 'Error al actualizar la propiedad')
        req.flash('tipoFlash', 'error')
        res.redirect('/auth/administrador/propiedades')
    }

}


const eliminarPropiedadAdministrador = async (req, res) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/administrador/propiedades')
    }
    // Eliminar la imagen de la propiedad
    if(propiedad.imagen !== 'default.jpg'){
        // Eliminar la imagen del servidor
        fs.unlinkSync(path.join(__dirname,'../public/uploads/',propiedad.imagen))
    }

    await propiedad.destroy()

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Propiedad eliminada correctamente')
    req.flash('tipoFlash', 'error')

    res.redirect('/auth/administrador/propiedades')
}


// Acciones del administrador con respecto a las categorías
const panelAdministradorCategorias = async (req, res) => {
    const {id} = req.usuario
    
    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    // Recuperar el filtro
    const { nombre } = req.query

    const filtro = {}

    if (nombre) filtro.nombre = { [Op.like]: `%${nombre}%` }

    const categorias = await Categoria.findAll({ where: filtro })

    res.render('usuario/Administrador/Administrador-Categorias', {
        titulo: 'Administrar Categorías',
        usuario: req.usuario,
        categorias,
        csrfToken: req.csrfToken(),
        pagina: 'Administrar Categorías'
    })
}

const crearCategoriaAdministrador = async (req, res) => {
    const {id} = req.usuario

    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador){
        return res.redirect('/auth/login')
    }

    res.render('usuario/Administrador/Administrador-Categorias-Crear', {
        titulo: 'Crear Categoría',
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        pagina: 'Crear Categoría'
    })
}

const crearCategoriaAdministradorPost = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    // No acepte Numeros
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener números').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es requerida').run(req)

    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.render('usuario/Administrador/Administrador-Categorias-Crear', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            usuario: req.usuario,
            pagina: 'Crear Categoría'
        })
    }

    const { nombre, descripcion } = req.body

    const categoriaExistente = await Categoria.findOne({ where: { nombre } })

    if (categoriaExistente) {
        return res.render('usuario/Administrador/Administrador-Categorias-Crear', {
            csrfToken: req.csrfToken(),
            ModalError: [{ msg: 'La categoría ya existe' }],
            oldData: req.body,
            usuario: req.usuario,
            pagina: 'Crear Categoría'
        })
    }


    await Categoria.create({
        nombre,
        descripcion
    })
    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Categoría creada correctamente')
    req.flash('tipoFlash', 'success')
    res.redirect('/auth/administrador/categorias')
}

const eliminarCategoriaAdministrador = async (req, res) => {
    const { id } = req.params

    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.redirect('/auth/administrador/categorias')
    }
    // Eliminar las propiedades que tengan la categoría
    await Propiedad.destroy({ where: { categoriaId: id } })
    // Eliminar la categoría
    await categoria.destroy()

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Categoría eliminada correctamente')
    req.flash('tipoFlash', 'error')
    res.redirect('/auth/administrador/categorias')
}

const editarCategoriaAdministrador = async (req, res) => {
    const { id } = req.params

    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.redirect('/auth/administrador/categorias')
    }

    res.render('usuario/Administrador/Administrador-Categorias-Editar', {
        titulo: 'Editar Categoría',
        usuario: req.usuario,
        categoria,
        csrfToken: req.csrfToken(),
        pagina: 'Editar Categoría'
    })
}

const editarCategoriaAdministradorPost = async (req, res) => {
    const { id } = req.params

    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    // No acepte Numeros
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener números').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es requerida').run(req)


    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        const categoria = await Categoria.findByPk(id)
        return res.render('usuario/Administrador/Administrador-Categorias-Editar', {
            csrfToken: req.csrfToken(),
            errores: errores.array(),
            oldData: req.body,
            usuario: req.usuario,
            categoria,
            pagina: 'Editar Categoría'
        })
    }

    const { nombre, descripcion } = req.body

    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.redirect('/auth/administrador/categorias')
    }

    const categoriaExistente = await Categoria.findOne({ 
        where: { 
            nombre,
            id: { [Op.ne]: id }
        } 
    })

    if (categoriaExistente) {
        return res.render('usuario/Administrador/Administrador-Categorias-Editar', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La categoría ya existe', path: 'nombre' }],
            oldData: req.body,
            usuario: req.usuario,
            categoria,
            pagina: 'Editar Categoría'
        })
    }

    categoria.nombre = nombre
    categoria.descripcion = descripcion
    await categoria.save()

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Categoría actualizada correctamente')
    req.flash('tipoFlash', 'success')
    res.redirect('/auth/administrador/categorias')
}



// Acciones del administrador con respecto a los mensajes


const eliminarMensajeAdministrador = async (req, res) => {
    // Encontramos al administrador
    const { id : usuarioId } = req.usuario;

    const administrador = await Usuario.findOne({ where: { id : usuarioId } });

    if(!administrador){
        return res.redirect('/auth/login')
    }

    const { id : mensajeId } = req.params;

    // Econtramos el mensaje
    const mensaje = await Mensaje.findByPk(mensajeId);

    if(!mensaje){
        return res.redirect('/auth/administrador/mensajes')
    }
    
    // Eliminamos el mensaje
    await mensaje.destroy();

    // Enviar un mensaje con flash
    req.flash('mensajeFlash', 'Mensaje eliminado correctamente')
    req.flash('tipoFlash', 'error')

    res.redirect('/auth/administrador/mensajes')
}

const verMensajeAdministrador = async (req, res) => {
    const { id } = req.params

    const mensaje = await Mensaje.findByPk(id)

    if(!mensaje){
        return res.redirect('/auth/administrador/mensajes')
    }

    res.render('usuario/Administrador/Administrador-Mensajes-Ver', {
        titulo: 'Ver Mensaje',
        usuario: req.usuario,
        mensaje,
        csrfToken: req.csrfToken(),
        pagina: 'Ver Mensaje'
    })
}



export {
    panelAdministrador,
    panelAdministradorUsuarios,
    panelAdministradorPropiedades,
    panelAdministradorMensajes,
    panelAdministradorPerfil,
    crearUsuarioAdministrador,
    crearUsuarioAdministradorPost,
    eliminarUsuarioAdministrador,
    editarUsuarioAdministrador,
    editarUsuarioAdministradorPost,
    eliminarPropiedadAdministrador,
    crearPropiedadAdministrador,
    crearPropiedadAdministradorPost,
    agregarImagenAdministradorPropiedad,
    subirImagenAdministradorPropiedad,
    editarPropiedadAdministrador,
    editarPropiedadAdministradorPost,
    panelAdministradorCategorias,
    crearCategoriaAdministrador,
    crearCategoriaAdministradorPost,
    eliminarCategoriaAdministrador,
    editarCategoriaAdministrador,
    editarCategoriaAdministradorPost,
    editarPerfilAdministradorPost,
    eliminarMensajeAdministrador,
    verMensajeAdministrador
}