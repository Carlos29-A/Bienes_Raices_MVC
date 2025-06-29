import { check, validationResult} from 'express-validator'
import { Usuario, ComentarioCalificacion, Propiedad } from '../models/index.js'


const CrearComentarioCalificacion = async (req, res) => {
    // Obtener el evaluador
    const { id } = req.usuario

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
        req.flash('mensajeFlash', erroresArray)
        req.flash('tipoFlash', 'error')
        return res.redirect(`/auth/usuario/perfil/${evaluadoId}`)
    }

    const evaluador = await Usuario.findByPk(id)

    // Verificar que el evaluador exista
    if(!evaluador){
        req.flash('mensajeFlash', ['El evaluador no existe'])
        req.flash('tipoFlash', 'error')
        return res.redirect(`/auth/usuario/perfil/${evaluadoId}`)
    }
    // Verificar que el evaluado exista
    if(!evaluado){
        req.flash('mensajeFlash', ['El evaluado no existe'])
        req.flash('tipoFlash', 'error')
        return res.redirect(`/auth/usuario/perfil/${evaluadoId}`)
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
        res.redirect(`/auth/usuario/perfil/${evaluadoId}`)
    }catch(error){
        console.log(error)
        req.flash('mensajeFlash', 'Error al crear el comentario')
        req.flash('tipoFlash', 'error')
        res.redirect(`/auth/usuario/perfil/${evaluadoId}`)
    }
}


export {
    CrearComentarioCalificacion
}