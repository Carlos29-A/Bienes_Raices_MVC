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
    res.redirect('/mensajes/obtener')
}

const obtenerMensajes = async (req, res) => {
    // Obtener los mensajes de la base de datos del usuario
    const { id } = req.usuario

    const remitente = await Usuario.findByPk(id)

    if(!remitente){
        return res.redirect('/auth/login')
    }

    // Mostrar los mensajes de la base de datos del usuario
    const mensajesEnviados = await Mensaje.findAll({
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
            }
        ]
    })
    // Obtener los mensajes respondidos del comprador
    const mensajesRespondidos = await Mensaje.findAll({
        where : {
            destinatarioId : id,
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
                attributes : ['nombre', 'email']
            }
        ]
    })

    res.render('mensajes/mensajes', {
        titulo: 'Mensajes',
        mensajesEnviados,
        remitente,
        csrfToken: req.csrfToken(),
        ruta: '/mensajes/obtener',
        mensajesRespondidos
    })
}

const obtenerMensajesVendedor = async (req, res) => {
    const { id } = req.usuario

    const destinatario = await Usuario.findByPk(id)

    if(!destinatario){
        return res.redirect('/auth/login')
    }

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

    res.render('mensajes/mensajesVendedor', {
        mensajes,
        destinatario,
        csrfToken: req.csrfToken(),
        ruta: '/mensajes/obtener/vendedor'
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


    // Validar si el editar el mensaje es el remitente
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
    res.redirect('/mensajes/obtener')
    
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
        res.redirect('/mensajes/obtener/vendedor')
    } else {
        res.redirect('/mensajes/obtener')
    }
}

const verMensaje = async (req, res) => {
    const { id } = req.usuario
    const { id: mensajeId } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id)
    if(!usuario) {
        return res.redirect('/auth/login')
    }

    // Obtener el mensaje con sus relaciones
    const mensaje = await Mensaje.findByPk(mensajeId, {
        include: [
            {
                model: Usuario,
                as: "remitenteRelacion",
                attributes: ['nombre', 'email', 'tipo']
            },
            {
                model: Usuario,
                as: "destinatarioRelacion",
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
            }
        ]
    })

    // Verificar si el mensaje existe
    if(!mensaje) {
        return res.redirect('/auth/login')
    }

    // Verificar si el usuario tiene permiso para ver el mensaje
    if(mensaje.remitenteId !== id && mensaje.destinatarioId !== id) {
        return res.redirect('/auth/login')
    }

    // Marcar el mensaje como leído si el usuario es el destinatario
    if(mensaje.destinatarioId === id && !mensaje.leido) {
        mensaje.leido = true
        await mensaje.save()
    }

    // Determinar la ruta para el sidebar
    const ruta = usuario.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener'

    res.render('mensajes/verMensaje', {
        mensaje,
        usuario,
        csrfToken: req.csrfToken(),
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
    // Determinar la ruta para el sidebar
    const ruta = remitente.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener'
    res.render('mensajes/responder', {
        mensaje,
        remitente,
        csrfToken: req.csrfToken(),
        ruta
    })
}

const responderMensajePost = async (req, res) => {


    const { id } = req.usuario
    const { id: mensajeId } = req.params
    // El id del de la persona que ve el mensaje es el id del id del remitente
    const remitente = await Usuario.findByPk(id)
    // Obtener todos los mensajes del remitente
    const mensajes = await Mensaje.findAll({
        where : {
            remitenteId : id
        },
        include : [
            {
                model : Usuario,
                as : "destinatarioRelacion",
                attributes : ['nombre', 'email', 'tipo']
            },
            {
                model : Propiedad,
                as : "propiedadRelacion",
            },
            {
                model : Usuario,
                as : "remitenteRelacion",
                attributes : ['nombre', 'email', 'tipo']
            }
        ]
    })
    if (!remitente) {
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
    
    // validar los datos del formulario
    await check('respuesta')
        .notEmpty().withMessage('La respuesta es requerida')
        .isLength({ min: 10 }).withMessage('La respuesta debe tener al menos 10 caracteres')
        .run(req)
    
    const errores = validationResult(req)

    if(!errores.isEmpty()){
        return res.render('mensajes/responder', {
            mensaje,
            remitente,
            csrfToken: req.csrfToken(),
            ruta : '/mensajes/obtener/vendedor',
            errores : errores.array()  
        })
    }
    const { respuesta } = req.body

    try{
        const mensajeCreado = await Mensaje.create({
            mensaje : respuesta,
            remitenteId : remitente.id,
            destinatarioId : mensaje.remitenteId,
            propiedadId : mensaje.propiedadId
        })
        const ruta = remitente.tipo.toString() === '1' ? '/mensajes/obtener/vendedor' : '/mensajes/obtener'

        req.flash('mensajeFlash', 'Mensaje enviado correctamente')
        req.flash('tipoFlash', 'exito')
        res.redirect(ruta)

    }catch(error){
        console.log(error)
    }
}




export {
    enviarMensaje,
    obtenerMensajes,
    eliminarMensaje,
    enviarMensajePost,
    editarMensaje,
    editarMensajePost,
    obtenerMensajesVendedor,
    verMensaje,
    responderMensaje,
    responderMensajePost
}