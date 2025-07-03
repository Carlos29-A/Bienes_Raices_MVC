import { check, validationResult } from 'express-validator'
import { Usuario, Propiedad, Categoria, Favorito } from '../models/index.js'
import { Op } from 'sequelize'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const registrarPropiedad = async (req, res) => {
    const usuario = await Usuario.findOne({ where: { id: req.usuario.id } })
    if (!usuario) {
        return res.redirect('/auth/login')
    }
    res.render('propiedades/crearPropiedad', {
        titulo: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        usuario,
        oldInfo: {},
        errores: [],
        ruta: '/propiedades/crearPropiedad',
        pagina: 'Crear Propiedad'
    })
}

const publicarPropiedad = async (req, res) => {
    await check('titulo').notEmpty().withMessage('El título es obligatorio').run(req)
    await check('precio').notEmpty().withMessage('El precio es obligatorio').run(req)
    await check('precio').isInt({min: 30000}).withMessage('El precio debe ser mayor a 30000').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es obligatoria').run(req)
    await check('categoria').notEmpty().withMessage('La categoría es obligatoria').run(req)
    await check('habitaciones').notEmpty().withMessage('El número de habitaciones es obligatorio').run(req)
    await check('wc').notEmpty().withMessage('El número de baños es obligatorio').run(req)
    await check('estacionamiento').notEmpty().withMessage('El número de estacionamientos es obligatorio').run(req)

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.render('propiedades/crearPropiedad', {
            titulo: 'Publicar Propiedad',
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            oldInfo: req.body,
            errores: errores.array(),
            ruta: '/propiedades/crearPropiedad',
            pagina: 'Crear Propiedad'
        })
    }

    try {
        const propiedad = await Propiedad.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            habitaciones: req.body.habitaciones,
            wc: req.body.wc,
            estacionamiento: req.body.estacionamiento,
            lat: req.body.lat,
            lng: req.body.lng,
            calle: req.body.calle,
            categoriaId: req.body.categoria,
            usuarioId: req.usuario.id
        })

        const { id } = propiedad

        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log(error)
        res.render('propiedades/crearPropiedad', {
            titulo: 'Publicar Propiedad',
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            oldInfo: req.body,
            errores: [{ msg: 'Hubo un error al publicar la propiedad' }],
            ruta: '/propiedades/crearPropiedad',
            pagina: 'Crear Propiedad'
        })
    }
}

const agregarImagen = async (req, res) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    if (propiedad.publicado) {
        return res.redirect('/auth/vendedor/panel')
    }

    // Validar que la propiedad pertenece a quien visita esta pagina
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    res.render('propiedades/agregarImagen', {
        titulo: 'Agregar Imagen',
        csrfToken: req.csrfToken(),
        propiedadId: id,
        usuario: req.usuario,
        propiedad: propiedad,
        pagina: 'Agregar Imagen'
    })
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    // Validar que la propiedad pertenece al usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    try {
        // Verificar que se subió un archivo
        if (!req.file) {
            return res.redirect(`/propiedades/agregar-imagen/${id}`)
        }

        // Almacenar la imagen en la base de datos
        propiedad.imagen = req.file.filename
        propiedad.publicado = true
        await propiedad.save()

        // Mandar mensaje de exito
        req.flash('mensajeFlash', 'Propiedad publicada correctamente')
        req.flash('tipoFlash', 'exito')

        next()
    } catch (error) {
        console.log('Error al guardar la imagen:', error)
        return res.redirect(`/propiedades/agregar-imagen/${id}`)
    }
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
        ruta: '/propiedades/mis-propiedades',
        pagina: 'Mis Propiedades'
    })
}


const editarPropiedad = async (req, res) => {
    const propiedad = await Propiedad.findByPk(req.params.id)
    const categorias = await Categoria.findAll()

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }
    // Validar que la propiedad pertenece al usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    res.render('propiedades/editarPropiedad', {
        propiedad,
        categorias,
        usuario: req.usuario,
        csrfToken: req.csrfToken(),
        oldInfo: propiedad,
        pagina: 'Editar Propiedad'
    })
}

const actualizarPropiedad = async (req, res) => {
    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(req.params.id)
    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    // Validar que la propiedad pertenece al usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    // Validar los campos
    await check('titulo').notEmpty().withMessage('El título es obligatorio').run(req)
    await check('precio').notEmpty().withMessage('El precio es obligatorio').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es obligatoria').run(req)
    await check('categoria').notEmpty().withMessage('La categoría es obligatoria').run(req)
    await check('habitaciones').notEmpty().withMessage('El número de habitaciones es obligatorio').run(req)
    await check('wc').notEmpty().withMessage('El número de baños es obligatorio').run(req)
    await check('estacionamiento').notEmpty().withMessage('El número de estacionamientos es obligatorio').run(req)
    await check('lat').notEmpty().withMessage('La ubicación es obligatoria').run(req)
    await check('lng').notEmpty().withMessage('La ubicación es obligatoria').run(req)

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        const categorias = await Categoria.findAll()
        return res.render('propiedades/editarPropiedad', {
            propiedad,
            categorias,
            usuario: req.usuario,
            csrfToken: req.csrfToken(),
            errores: errores.array()
        })
    }

    try {
        // Actualizar la propiedad
        await propiedad.update({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            habitaciones: req.body.habitaciones,
            wc: req.body.wc,
            estacionamiento: req.body.estacionamiento,
            lat: req.body.lat,
            lng: req.body.lng,
            calle: req.body.calle,
            categoriaId: req.body.categoria
        })
        // Mandar mensaje de exito
        req.flash('mensajeFlash', 'Propiedad actualizada correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect('/propiedades/mis-propiedades')
        
    } catch (error) {
        console.log(error)
        const categorias = await Categoria.findAll()
        res.render('propiedades/editarPropiedad', {
            propiedad,
            categorias,
            usuario: req.usuario,
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Hubo un error al actualizar la propiedad' }]
        })
    }
}

const eliminarPropiedad = async (req, res) => {
    const propiedad = await Propiedad.findByPk(req.params.id)

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    // Eliminar la imagen de la propiedad
    if (propiedad.imagen) {
        const pathImagen = path.join(__dirname, '../public/uploads/', propiedad.imagen)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }
    
    // Eliminar la propiedad
    await propiedad.destroy()

    req.flash('mensajeFlash', 'Propiedad eliminada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/propiedades/mis-propiedades')
}

const cambiarEstado = async (req, res) => {
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    propiedad.publicado = !propiedad.publicado
    await propiedad.save()

    res.json({
        resultado: true
    })
}

const cambiarEstadoDesactivar = async (req, res) => {
    const propiedad = await Propiedad.findByPk(req.params.id)
    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    propiedad.publicado = false
    await propiedad.save()

    req.flash('mensajeFlash', 'Propiedad desactivada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/vendedor/panel')
}
const cambiarEstadoActivar = async (req, res) => {
    const propiedad = await Propiedad.findByPk(req.params.id)
    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    propiedad.publicado = true
    await propiedad.save()

    req.flash('mensajeFlash', 'Propiedad activada correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/auth/vendedor/panel')
}


// API para obtener todas las propiedades filtradas
const obtenerPropiedades = async (req, res) => {
    const { estado, categoria, buscar } = req.query

    // Construir filtros base
    const filtros = {
        usuarioId: req.usuario.id
    }

    // Agregar filtro de estado si se selecciona
    if (estado === '0') {
        filtros.publicado = false
    } else if (estado === '1') {
        filtros.publicado = true
    }
    if (buscar) {
        filtros.titulo = {
            [Op.like]: `%${buscar}%`
        }
    }

    // Agregar filtro de categoría si se selecciona
    if (categoria) {
        filtros.categoriaId = categoria
    }

    try {
        const propiedades = await Propiedad.findAll({
            where: filtros,
            include: [
                {
                    model: Categoria,
                    as: 'categoriaRelacion',
                    attributes: ['nombre']
                }
            ]
        })

        return res.json(propiedades)

    } catch (error) {
        console.error('Error al obtener propiedades:', error)
        return res.status(500).json({ error: 'Error al obtener propiedades' })
    }
}

const buscarPropiedades = async (req, res) => {

    // Recuperamos a la persona que inicia sesión
    const { id } = req.usuario
    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.redirect('/auth/login')
    }

    const { categoria, precio_min, precio_max, habitaciones, wc, estacionamiento, calle } = req.query

    // Filtros base
    const filtros = {
        publicado: true
    }
    if (categoria) {
        filtros.categoriaId = categoria
    }
    if (precio_min) {
        filtros.precio = {
            [Op.gte]: precio_min
        }
    }
    if (precio_max) {
        filtros.precio = {
            [Op.lte]: precio_max
        }
    }
    if (habitaciones) {
        filtros.habitaciones = habitaciones
    }
    if (wc) {
        filtros.wc = wc
    }
    if (estacionamiento) {
        filtros.estacionamiento = estacionamiento
    }
    if (calle) {
        filtros.calle = {
            [Op.like]: `%${calle}%`
        }
    }

    // Recuperamos las propiedades con los filtros
    const propiedades = await Propiedad.findAll({
        where: filtros,
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']

            },
            {
                model: Usuario,
                as: 'usuarioRelacion',
                attributes: ['id', 'nombre', 'email']
            }

        ]
    })
    // Recuperamos los favoritos del usuario
    const favoritos = await Favorito.findAll({
        where: {
            usuarioId: req.usuario.id
        }
    })

    res.render('propiedades/buscarPropiedades', {
        propiedades,
        csrfToken: req.csrfToken(),
        usuario,
        favoritos,
        ruta: '/propiedades/buscar'
    })


}

// Ver una propiedad en detalle
const verPropiedad = async (req, res) => {
    const { id } = req.params

    // Recuperamos el usuario
    const usuario = await Usuario.findByPk(req.usuario.id)

    if (!usuario) {
        return res.redirect('/auth/login')
    }
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
            },
            {
                model: Usuario,
                as: 'usuarioRelacion',
            }
        ]
    })

    // Recuperamos los favoritos del usuario
    const favoritos = await Favorito.findAll({
        where: {
            usuarioId: req.usuario.id
        }
    })
    
    res.render('propiedades/detallePropiedad', {
        propiedad,
        usuario,
        favoritos,
        csrfToken: req.csrfToken()
    })
}

const obtenerCategorias = async (req, res) => {
    const idUsuario = req.usuario.id
    const { id } = req.params
    const propiedades = await Propiedad.findAll({
        where : {
            categoriaId : id
        },
        include : [
            {
                model : Categoria,
                as : "categoriaRelacion"
            },
            {
                model : Usuario,
                as : "usuarioRelacion"
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
    // Obtener el nombre de la categoría
    const nombreCategoria = await Categoria.findByPk(id)
    
    return res.render('propiedades/categorias', {    
        propiedades,
        favoritos,
        csrfToken: req.csrfToken(),
        idUsuario,
        id,
        titulo: nombreCategoria.nombre,
        ruta: '/propiedades/categorias/' + id
        
    })
}


export {
    registrarPropiedad,
    publicarPropiedad,
    agregarImagen,
    almacenarImagen,
    misPropiedades,
    editarPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
    cambiarEstado,
    cambiarEstadoDesactivar,
    cambiarEstadoActivar,
    obtenerPropiedades,
    buscarPropiedades,
    verPropiedad,
    obtenerCategorias

}
