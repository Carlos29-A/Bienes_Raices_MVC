// Pagina principal
import { Propiedad, Categoria, Usuario } from '../models/index.js'
import { Op } from 'sequelize'

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
const contacto  = async function(req, res) {
    res.render('public/contacto', {
        titulo: 'Contacto',
        pagina: 'contacto',
        ruta: '/contacto'
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


export {
    paginaPrincipal,
    nosotros,
    contacto,
    buscarPropiedades,
    verPropiedad
}





