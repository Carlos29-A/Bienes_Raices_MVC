import { Usuario, Mensaje, Propiedad, Categoria } from '../models/index.js'
import { check, validationResult } from 'express-validator'

const enviarMensaje = async (req, res) => {
    
    const { idPropiedad, idVendedor } = req.params

    const { id } = req.usuario

    // Obtener el remitente
    const remitente = await Usuario.findByPk(id)
    
    if(!remitente){
        return res.redirect('/auth/login')
    }
    
    const destinatario = await Usuario.findByPk(idVendedor)
    const propiedad = await Propiedad.findByPk(idPropiedad, {
        include :[
            {
                model: Categoria,
                as : "categoriaRelacion"
            }
        ]
    })

    res.render('mensajes/enviar', {
        csrfToken: req.csrfToken(),
        remitente,
        destinatario,
        propiedad
    })
}

const enviarMensajePost = async (req, res) => {

    const { idPropiedad, idVendedor } = req.params

    const { id } = req.usuario

    const remitente = await Usuario.findByPk(id)


    if(!remitente){
        return res.redirect('/auth/login')
    }

    const destinatario = await Usuario.findByPk(idVendedor)

    if(!destinatario){
        return res.redirect('/auth/login')
    }

    const propiedad = await Propiedad.findByPk(idPropiedad, {
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

    if(!propiedad){
        return res.redirect('/auth/login')
    }

    const { mensaje } = req.body
    
    await check('mensaje')
        .notEmpty().withMessage('El mensaje es requerido')
        .isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
        .run(req)

    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('mensajes/enviar', {
            errores : errores.array(),
            remitente,
            destinatario,
            propiedad,
            csrfToken: req.csrfToken(),
            mensaje
        })
    }

    const mensajeCreado = await Mensaje.create({
        mensaje,
        remitenteId: remitente.id,
        destinatarioId: destinatario.id,
        propiedadId: propiedad.id
    })

    req.flash('mensajeFlash', 'Mensaje enviado correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/mensajes/obtener/comprador')
}

const obtenerMensajesComprador = async (req, res) => {
    // Obtener el usuario
    const { id } = req.usuario

    const comprador = await Usuario.findByPk(id)

    if(!comprador){
        return res.redirect('/auth/login')
    }

    // Obtener los mensajes de la base de datos del usuario
    const mensajes = await Mensaje.findAll({
        include : [
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
            },
            {
                model : Usuario,
                as : "destinatarioRelacion",
            }
        ]

    })

    // Mostrar mensajes Enviados
    const mensajesEnviados = mensajes.filter(mensaje => mensaje.remitenteId === id)
    // Mostrar mensajes Recibidos
    const mensajesRecibidos = mensajes.filter(mensaje => mensaje.destinatarioId === id)
    // Mostrar mensajes Respondidos
    const mensajesRespondidos = mensajes.filter(mensaje => mensaje.respuestaId !== null && mensaje.remitenteId === id)

    res.render('mensajes/mensajesComprador', {
        titulo: 'Mensajes',
        comprador,
        csrfToken: req.csrfToken(),
        ruta: '/mensajes/obtener/comprador',
        mensajesEnviados,
        mensajesRecibidos,
        mensajesRespondidos
    })
}

const obtenerMensajesVendedor = async (req, res) => {
    const { id } = req.usuario

    const destinatario = await Usuario.findByPk(id)

    if(!destinatario){
        return res.redirect('/auth/login')
    }

    // Mensajes recibidos por el vendedor
    const mensajes = await Mensaje.findAll({
        where : {
            destinatarioId : id
        },
        include : [
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
            },
            {
                model : Usuario,
                as : "destinatarioRelacion",
            }
        ]
    })

    // Mensajes enviados por el vendedor (respuestas)
    const mensajesRespondidos = await Mensaje.findAll({
        where : {
            remitenteId : id
        },
        include : [
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
                include : [
                    {
                        model : Categoria,
                        as : "categoriaRelacion"
                    }
                ]
            },
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email']
            }
        ]
    })

    const mensajesLeidos = mensajes.filter(mensaje => mensaje.leido === true)
    const mensajesNoLeidos = mensajes.filter(mensaje => mensaje.leido === false)

    res.render('mensajes/mensajesVendedor', {
        mensajes,
        destinatario,
        csrfToken: req.csrfToken(),
        ruta: '/mensajes/obtener/vendedor',
        pagina: 'Mensajes',
        mensajesLeidos,
        mensajesNoLeidos,
        mensajesRespondidos
    })
}
const editarMensaje = async (req, res) => {

    const { id } = req.usuario

    const remitente = await Usuario.findByPk(id)
 
    // Verificar si el usuario existe
    if(!remitente){
        return res.redirect('/auth/login')
    }
    
    // Verificar si el mensaje existe
    const mensaje = await Mensaje.findByPk(req.params.id, {
        include : [
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email']
            },
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

    // Verificar si el mensaje existe
    if(!mensaje){
        return res.redirect('/auth/login')
    } 
    res.render('mensajes/editar', {
        mensaje,
        remitente,
        csrfToken: req.csrfToken()
    })
}
const editarMensajePost = async (req, res) => {

    const { id } = req.usuario

    const remitente = await Usuario.findByPk(id)

    if(!remitente){
        return res.redirect('/auth/login')
    }

    // Verificar si el mensaje existe
    const mensaje = await Mensaje.findByPk(req.params.id, {
        include : [
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email']    
            },
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
    
    if(!mensaje){
        return res.redirect('/auth/login')
    }


    // Validar si el usuario puede editar el mensaje (debe ser el remitente)
    if(mensaje.remitenteId !== remitente.id){
        return res.redirect('/auth/login')
    }
    
    // Validar si el mensaje es requerido
    await check('mensaje')
        .notEmpty().withMessage('El mensaje es requerido')
        .isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
        .run(req)
    
    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('mensajes/editar', {
            errores : errores.array(),
            mensaje,
            remitente,
            csrfToken: req.csrfToken()
        })
    }

    mensaje.mensaje = req.body.mensaje

    await mensaje.save()

    req.flash('mensajeFlash', 'Mensaje editado correctamente')
    req.flash('tipoFlash', 'exito')
    
    // Redirigir a la página de mensajes según el tipo de usuario
    if(remitente.tipo.toString() === '1') {
        res.redirect('/mensajes/obtener/vendedor')
    } else {
        res.redirect('/mensajes/obtener/comprador')
    }
    
}


const eliminarMensaje = async (req, res) => {
    const { id } = req.usuario

    const remitente = await Usuario.findByPk(id)

    if(!remitente){
        return res.redirect('/auth/login')
    }

    const mensaje = await Mensaje.findByPk(req.params.id)

    if(!mensaje){
        return res.redirect('/auth/login')
    }

    // Verificar si el usuario tiene permiso para eliminar el mensaje
    if(mensaje.remitenteId !== id){
        return res.redirect('/auth/login')
    }


    await mensaje.destroy()

    // Redirigir a la página de mensajes según el tipo de usuario
    if(remitente.tipo.toString() === '1') {
        req.flash('mensajeFlash', 'Mensaje eliminado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect('/mensajes/obtener/vendedor')
    } else {
        req.flash('mensajeFlash', 'Mensaje eliminado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect('/mensajes/obtener/comprador')
    }
}

const verMensaje = async (req, res) => {
    const { id } = req.params
    const usuario = req.usuario

    const mensaje = await Mensaje.findByPk(id, {
        include: [
            {
                model: Usuario,
                as: "remitenteRelacion",
                attributes: ['nombre', 'email', 'tipo']
            },
            {
                model: Propiedad,
                as: "propiedadRelacion",
                include: [
                    {
                        model: Categoria,
                        as: "categoriaRelacion"
                    }
                ]
            },
            {
                model: Usuario,
                as: "destinatarioRelacion",
                attributes: ['nombre', 'email', 'tipo']
            }
        ]
    })

    if (!mensaje) {
        return res.redirect('/404')
    }

    // Verificar que el usuario sea parte del mensaje
    if (mensaje.remitenteId !== usuario.id && mensaje.destinatarioId !== usuario.id) {
        return res.redirect('/404')
    }

    // Marcar el mensaje como leído si el usuario actual es el destinatario
    if (mensaje.destinatarioId === usuario.id && !mensaje.leido) {
        mensaje.leido = true
        await mensaje.save()
    }

    // Determinar la ruta para el sidebar
    const ruta = usuario.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener/comprador'

    res.render('mensajes/verMensaje', {
        pagina: 'Ver Mensaje',
        csrfToken: req.csrfToken(),
        mensaje,
        usuario,
        ruta
    })
}

const responderMensaje = async (req, res) => {

    const { id } = req.usuario
    const { id: mensajeId } = req.params
    // El id del de la persona que ve el mensaje es el id del id del remitente
    const remitente = await Usuario.findByPk(id)

    if(!remitente){
        return res.redirect('/auth/login')
    }

    const mensaje = await Mensaje.findByPk(mensajeId, 
        {
            include : [
                {
                    model : Usuario,
                    as : "remitenteRelacion",
                    attributes : ['nombre', 'email', 'tipo']
                },
                {
                    model : Propiedad,
                    as : "propiedadRelacion",
                },
                {
                    model : Usuario,
                    as : "destinatarioRelacion",
                    attributes : ['nombre', 'email', 'tipo']
                }
            ]
        }
    )

    if(!mensaje){
        return res.redirect('/auth/login')
    }
    // Verificar si el usuario tiene permiso para responder el mensaje
    if(mensaje.destinatarioId !== id){
        return res.redirect('/auth/login')
    }
    // Verificar si ya respondi el mensaje
    if(mensaje.respuestaId === mensaje.id){
        return res.redirect('/auth/login')
    }
    // Determinar la ruta para el sidebar
    const ruta = remitente.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener/comprador'
    res.render('mensajes/responder', {
        mensaje,
        remitente,
        csrfToken: req.csrfToken(),
        ruta,
        pagina : 'Mensajes'
    })
}

const responderMensajePost = async (req, res) => {

    // Obtener el id del remitente
    const { id } = req.usuario
    // Obtener el id del mensaje
    const { id: mensajeId } = req.params
    
    // Obtener el remitente
    const remitente = await Usuario.findByPk(id)

    if(!remitente){
        return res.redirect('/auth/login')
    }
    
    // Obtener el mensaje
    const mensaje = await Mensaje.findByPk(mensajeId, {
        include : [
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email', 'tipo']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
                include : [
                    {
                        model : Categoria,
                        as : "categoriaRelacion"
                    }
                ]
            },
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email', 'tipo']
            }
        ]

    })

    if(!mensaje){
        return res.redirect('/auth/login')
    }

    // Verificar si el usuario tiene permiso para responder el mensaje
    if(mensaje.destinatarioId !== id){
        return res.redirect('/auth/login')
    }
    
    // Validar si el mensaje es requerido
    await check('respuesta')
        .notEmpty().withMessage('La respuesta es requerida')
        .isLength({ min: 10 }).withMessage('La respuesta debe tener al menos 10 caracteres')
        .run(req)

    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('mensajes/responder', {
            errores : errores.array(),
            mensaje,
            remitente,
            csrfToken: req.csrfToken(),
            pagina : 'Mensajes'
        })
    }
    const ruta = remitente.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener/comprador'
    
    // Marcar el mensaje original como leído
    await mensaje.update({
        leido: true
    })

    // Crear la respuesta
    const respuesta = await Mensaje.create({
        mensaje : req.body.respuesta,
        remitenteId : id,
        destinatarioId : mensaje.remitenteId,
        propiedadId : mensaje.propiedadId,
        respuestaId : mensaje.id,
        leido: false // La respuesta inicia como no leída para el destinatario
    })
    //Enviar mensaje de exito
    req.flash('mensajeFlash', 'Mensaje respondido correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect(ruta)
    
}


const responderMensajeComprador = async (req, res) => {

    const { id } = req.usuario
    const { id: mensajeId } = req.params

    const comprador = await Usuario.findByPk(id)

    if(!comprador){ 
        return res.redirect('/auth/login')
    }

    const mensaje = await Mensaje.findByPk(mensajeId, {
        include : [
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email', 'tipo']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
                include : [ 
                    {
                        model : Categoria,
                        as : "categoriaRelacion"
                    }
                ]
            },
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email', 'tipo']
            }
        ]
    })

    if(!mensaje){
        return res.redirect('/auth/login')
    }

    res.render('mensajes/responderComprador', {
        mensaje,
        comprador,
        csrfToken: req.csrfToken(),
        pagina : 'Mensajes'
    })
    

}

const responderMensajeCompradorPost = async (req, res) => {

    const { id } = req.usuario
    const { id: mensajeId } = req.params

    const comprador = await Usuario.findByPk(id)

    if(!comprador){
        return res.redirect('/auth/login')
    }
    const mensaje = await Mensaje.findByPk(mensajeId, {
        include: [
            {
                model: Usuario,
                as: "remitenteRelacion",
                attributes: ['nombre', 'email', 'tipo']
            },
            {
                model: Propiedad,
                as: "propiedadRelacion",
                include: [
                    {
                        model: Categoria,
                        as: "categoriaRelacion"
                    }
                ]
            },
            {
                model: Usuario,
                as: "destinatarioRelacion",
                attributes: ['nombre', 'email', 'tipo']
            }
        ]
    })
    // Validar campo
    await check('respuesta')
        .notEmpty().withMessage('La respuesta es requerida')
        .isLength({ min: 10 }).withMessage('La respuesta debe tener al menos 10 caracteres')
        .run(req)

    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('mensajes/responderComprador', {
            errores : errores.array(),
            mensaje,
            comprador,
            csrfToken: req.csrfToken(),
            pagina : 'Mensajes'
        })
    }

    if(!mensaje){
        return res.redirect('/auth/login')
    }
    

    // Crear la respuesta
    await Mensaje.create({
        mensaje : req.body.respuesta,
        remitenteId : id,
        destinatarioId : mensaje.remitenteId,
        propiedadId : mensaje.propiedadId,
        respuestaId : mensaje.id
    })

    // Marcar el mensaje como leído
    mensaje.leido = true
    await mensaje.save()

    // Enviar el mensaje de exito
    req.flash('mensajeFlash', 'Mensaje respondido correctamente')
    req.flash('tipoFlash', 'exito')
    res.redirect('/mensajes/obtener/comprador')
    
}

// Nuevo endpoint para obtener el conteo de mensajes no leídos
const obtenerMensajesNoLeidos = async (req, res) => {
    try {
        const { id } = req.usuario
        
        const cantidadNoLeidos = await Mensaje.count({
            where: {
                destinatarioId: id,
                leido: false
            }
        })

        return res.json({ cantidadNoLeidos })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error al obtener mensajes no leídos' })
    }
}

export {
    enviarMensaje,
    obtenerMensajesComprador,
    eliminarMensaje,
    enviarMensajePost,
    editarMensaje,
    editarMensajePost,
    obtenerMensajesVendedor,
    verMensaje,
    responderMensaje,
    responderMensajePost,
    responderMensajeComprador,
    responderMensajeCompradorPost,
    obtenerMensajesNoLeidos
}