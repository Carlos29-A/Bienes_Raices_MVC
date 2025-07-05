// Pagina principal
import { Propiedad, Categoria, Usuario, ComentarioCalificacion } from '../models/index.js'
import { Op } from 'sequelize'
import Contacto from '../models/Contacto.js'
import { emailContacto } from '../helpers/email.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const paginaPrincipal = async function(req, res) {
    try {
        // Obtener todas las propiedades publicadas con su categoría
        const propiedades = await Propiedad.findAll({
            where: { publicado: true },
            include: [
                {
                    model: Categoria,
                    as: 'categoriaRelacion',
                    attributes: ['nombre']
                }
            ]
        });
        // Obtener todas las categorías
        const categorias = await Categoria.findAll();

        res.render('public/home', {
            titulo: 'Inicio',
            propiedades,
            categorias,
            pagina: 'home',
            ruta: '/'
        });
    } catch (error) {
        res.status(500).send('Error en la página principal');
    }
}

// Nosotros 
const nosotros = async function(req, res){
    res.render('public/nosotros', {
        titulo: 'Nosotros',
        pagina: 'nosotros',
        ruta: '/nosotros'
    })
}

// Buscar propiedades
const buscarPropiedades = async function(req, res){
    try {
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

        // Obtener todas las categorías para los filtros
        const categorias = await Categoria.findAll();

        res.render('public/buscarPropiedades', {
            titulo: 'Buscar Propiedades',
            propiedades,
            categorias,
            csrfToken: req.csrfToken(),
            ruta: '/buscarPropiedades',
            pagina: 'buscarPropiedades'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en la búsqueda de propiedades');
    }
}

// Contacto
const contacto = (req, res) => {
    res.render('public/contacto', {
        pagina: 'Contacto',
        csrfToken: req.csrfToken(),
        ruta: '/contacto',
        pagina: 'Contacto'
    })
}

// Ver propiedad
const verPropiedad = async function(req, res) {
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id, {
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

    res.render('propiedades/detallePropiedad', {
        titulo: 'Ver Propiedad',
        propiedad,
        ruta: '/buscarPropiedades',
        pagina: 'propiedad'
    })
}

const enviarContacto = async (req, res) => {
    const { tipo_usuario, email, categoria, asunto, mensaje } = req.body

    // Validaciones
    const errores = []

    if (!tipo_usuario) {
        errores.push('El tipo de usuario es obligatorio')
    }

    if (!email) {
        errores.push('El email es obligatorio')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.push('El email no es válido')
    }

    if (!categoria) {
        errores.push('La categoría es obligatoria')
    }

    if (!asunto) {
        errores.push('El asunto es obligatorio')
    } else if (asunto.length < 5) {
        errores.push('El asunto debe tener al menos 5 caracteres')
    }

    if (!mensaje) {
        errores.push('El mensaje es obligatorio')
    } else if (mensaje.length < 20) {
        errores.push('El mensaje debe tener al menos 20 caracteres')
    }

    // Si hay errores
    if (errores.length > 0) {
        // Mostrar errores
        req.flash('error', errores)
        return res.redirect('/contacto')
    }

    try {
        // Crear el registro en la base de datos
        const contacto = await Contacto.create({
            tipo_usuario,
            email,
            categoria,
            asunto,
            mensaje
        })

        // Enviar email
        await emailContacto({
            email,
            asunto,
            mensaje,
            tipo: categoria
        })

        // Mensaje de éxito
        req.flash('mensajeFlash', 'Consulta enviada correctamente')
        req.flash('tipoFlash', 'success')
        res.redirect('/contacto')

    } catch (error) {
        console.error(error)
    }
}

// Ver perfil vendedor
const verPerfilVendedor = async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.redirect('/buscarPropiedades')
    }
    // obtener las propiedades del usuario
    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: id
        }
    })
    // Obtener los comentarios del usuario
    const comentarios = await ComentarioCalificacion.findAll({
        where: {
            evaluadoId: id
        },
        include: [
            {
                model: Usuario,
                as: 'evaluadorRelacion',
                attributes: ['id', 'nombre', 'email']
            },
            {
                model : Usuario,
                as: 'evaluadoRelacion',
                attributes: ['id', 'nombre', 'email']
            }
        ]
    })

    return res.render('public/perfilVendedor', {
        titulo: 'Ver Perfil Vendedor',
        pagina: 'verPerfilVendedor',
        ruta: '/buscarPropiedades',
        usuario,
        propiedades,
        comentarios
    })
}

export {
    paginaPrincipal,
    nosotros,
    contacto,
    buscarPropiedades,
    verPropiedad,
    enviarContacto,
    verPerfilVendedor
}





