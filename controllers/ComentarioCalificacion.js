import { check, validationResult} from 'express-validator'
import { Usuario, ComentarioCalificacion, Propiedad, Categoria } from '../models/index.js'


const CrearComentarioCalificacionPost = async (req, res) => {
    // Obtener el evaluador
    const { id } = req.usuario
    // Obtener los comentarios del usuario
    const comentarios = await ComentarioCalificacion.findAll({ where: { evaluadoId: id },
        include: [
            {
                model: Usuario,
                as: 'evaluadorRelacion',
            },
            {
                model: Usuario,
                as: 'evaluadoRelacion',
            }
        ] })
    // Obtener el evaluado
    const { id : evaluadoId } = req.params
    const evaluado = await Usuario.findByPk(evaluadoId)
    const propiedades = await Propiedad.findAll({ where: { usuarioId: evaluadoId } })

    // Validar los datos
    await check('calificacion', 'La calificacion es requerida').notEmpty().isInt({ min: 1, max: 5 }).run(req)
    await check('comentario', 'El comentario es requerido').notEmpty().run(req)
    
    
    // Verificar los errores
    const errores = validationResult(req)
    const erroresArray = errores.array().map(error => error.msg)
    
    // Si hay errores, renderizar la vista con los errores
    if(!errores.isEmpty()){
        return res.render('usuario/perfil', {
            errores : errores.array(),
            usuario : evaluado,
            propiedades,
            comentarios,
            csrfToken : req.csrfToken()
        })
    }
    const evaluador = await Usuario.findByPk(id)

    // Verificar que el evaluador exista
    if(!evaluador){
        return res.render('usuario/perfil', {
            errores : ['El evaluador no existe'],
            usuario : evaluado,
            propiedades,
            comentarios,
            csrfToken : req.csrfToken()
        })
    }
    // Verificar que el evaluado exista
    if(!evaluado){
        return res.render('usuario/perfil', {
            errores : ['El evaluado no existe'],
            usuario : evaluado,
            propiedades,
            comentarios,
            csrfToken : req.csrfToken()
        })
    }

    try{
        const { calificacion, comentario } = req.body
        const comentarioCalificacion = await ComentarioCalificacion.create({
            calificacion,
            comentario,
            evaluadorId: id,
            evaluadoId: evaluadoId
        })
        req.flash('mensajeFlash', 'Comentario creado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${evaluadoId}`)
    }catch(error){
        
        req.flash('mensajeFlash', 'Error al crear el comentario')
        req.flash('tipoFlash', 'error')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${evaluadoId}`)
    }
}
const crearComentarioCalificacion = async (req, res) => {

    const { id } = req.params

    // Buscar al usuario
    const usuario = await Usuario.findByPk(id)

    // Si no existe el usuario, redirigir a la pagina de inicio
    if (!usuario) {
        return res.redirect('/auth/login')
    }
    // Buscar el usuario que esta logueado
    const { id : evaluadorId } = req.usuario
    const evaluador = await Usuario.findByPk(evaluadorId)
    if(!evaluador){
        return res.redirect('/auth/login')
    }

    // Buscar las propiedades del usuario
    const propiedades = await Propiedad.findAll({
        where: { usuarioId: id },
        include: [
            {
                model: Categoria,
                as: 'categoriaRelacion',
                attributes: ['nombre']
            }
        ]
    })
    // Buscar los comentarios del usuario
    const comentarios = await ComentarioCalificacion.findAll({ where: { evaluadoId: id },
        include: [
            {
                model: Usuario,
                as: 'evaluadoRelacion',
            },
            {
                model: Usuario,
                as: 'evaluadorRelacion',
            }
        ] 
    }
)



    res.render('usuario/perfil', {
        usuario,
        propiedades,
        comentarios,
        evaluador,
        csrfToken: req.csrfToken()
    })
}
const editarComentarioCalificacion = async (req, res) => {

    const { id } = req.params

    // Buscar el usuario que esta logueado
    const { id : evaluadorId } = req.usuario
    const evaluador = await Usuario.findByPk(evaluadorId)
    if(!evaluador){
        return res.redirect('/auth/login')
    }

    // Buscar el comentario
    const comentario = await ComentarioCalificacion.findByPk(id, {
        include: [
            {
                model: Usuario,
                as: 'evaluadorRelacion',
            },
            {
                model: Usuario,
                as: 'evaluadoRelacion',
            },
        ]
    })
    console.log(comentario)
    if(!comentario){
        return res.redirect('/auth/login')
    }
    // Buscar las propiedades del usuario
    const propiedades = await Propiedad.findAll({ where: { usuarioId: comentario.evaluadoId } })

    res.render('comentario-calificacion/editar', {
        comentario,
        evaluador,
        propiedades,
        csrfToken: req.csrfToken()
    })
}
const editarComentarioCalificacionPost = async (req, res) => {
    const { id } = req.params

    // Buscar el comentario con sus relaciones
    const comentario = await ComentarioCalificacion.findByPk(id, {
        include: [
            {
                model: Usuario,
                as: 'evaluadorRelacion',
            },
            {
                model: Usuario,
                as: 'evaluadoRelacion',
            },
        ]
    })
    if(!comentario){
        return res.redirect('/auth/login')
    }
    // Buscar el usuario que esta logueado
    const { id : evaluadorId } = req.usuario
    const evaluador = await Usuario.findByPk(evaluadorId)
    if(!evaluador){
        return res.redirect('/auth/login')
    }

    // Buscar las propiedades del usuario
    const propiedades = await Propiedad.findAll({ where: { usuarioId: comentario.evaluadoId } })

    // Validar los datos
    await check('calificacion', 'La calificacion es requerida').notEmpty().isInt({ min: 1, max: 5 }).run(req)
    await check('comentario', 'El comentario es requerido').notEmpty().run(req)

    // Verificar los errores
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.render('comentario-calificacion/editar', {
            errores: errores.array(),
            comentario,
            evaluador,
            propiedades,
            csrfToken: req.csrfToken()
        })
    }
    try{
        const { calificacion, comentario: nuevoComentario } = req.body
        comentario.calificacion = calificacion
        comentario.comentario = nuevoComentario
        await comentario.save()
        req.flash('mensajeFlash', 'Comentario editado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${comentario.evaluadoId}`)
    }catch(error){
        req.flash('mensajeFlash', 'Error al editar el comentario')
        req.flash('tipoFlash', 'error')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${comentario.evaluadoId}`)
    }
}
const eliminarComentarioCalificacion = async (req, res) => {
    const { id } = req.params
    
    // Buscar el comentario
    const comentario = await ComentarioCalificacion.findByPk(id)
    if(!comentario){
        console.log('Comentario no encontrado')
        return res.redirect('/auth/login')
    }
    
    
    // Verificar que el usuario que elimina sea el mismo que creó el comentario
    const { id: evaluadorId } = req.usuario
    
    if(comentario.evaluadorId !== evaluadorId){
        return res.redirect('/auth/login')
    }
    
    try {
        await comentario.destroy()
        req.flash('mensajeFlash', 'Comentario eliminado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${comentario.evaluadoId}`)
    } catch(error) {
        console.error('Error al eliminar comentario:', error)
        req.flash('mensajeFlash', 'Error al eliminar el comentario')
        req.flash('tipoFlash', 'error')
        res.redirect(`/comentario-calificacion/crear-comentario-calificacion/${comentario.evaluadoId}`)
    }
}

export {
    CrearComentarioCalificacionPost,
    crearComentarioCalificacion,
    editarComentarioCalificacion,
    editarComentarioCalificacionPost,
    eliminarComentarioCalificacion
}