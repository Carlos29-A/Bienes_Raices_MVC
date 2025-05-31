import { check, validationResult } from 'express-validator'
import { Usuario, Propiedad, Categoria } from '../models/index.js'

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
        errores: []
    })
}

const publicarPropiedad = async (req, res) => {
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
        return res.render('propiedades/crearPropiedad', {
            titulo: 'Publicar Propiedad',
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            oldInfo: req.body,
            errores: errores.array()
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
            errores: [{ msg: 'Hubo un error al publicar la propiedad' }]
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
        propiedad: propiedad
    })
}

const almacenarImagen = async (req, res, next) => {

    const { id } = req.params
    console.log('Subiendo imagen...')
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/auth/vendedor/panel')
    }

    if (propiedad.publicado === false) {
        return res.redirect('/auth/vendedor/panel')
    }

    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/auth/vendedor/panel')
    }

    try {

        // Almacenar la imagen en la base de datos
        propiedad.imagen = req.file.filename
        propiedad.publicado = false
        await propiedad.save()

        next()
    } catch (error) {
        console.log(error)
    }


}


export {
    registrarPropiedad,
    publicarPropiedad,
    agregarImagen,
    almacenarImagen
}
