import { Propiedad, Categoria, Usuario, Favorito } from "../models/index.js"
import { Op } from "sequelize"

const obtenerPropiedades = async (req, res) => {
    const propiedades = await Propiedad.findAll({
        where : {
            publicado : true
        },
        include :[
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

    res.json(propiedades)
}

const obtenerPropiedadesAdmin = async (req, res) => {
    const propiedades = await Propiedad.findAll({
        include: [
            {
                model: Categoria,
                as: "categoriaRelacion"
            },
            {
                model: Usuario,
                as: "usuarioRelacion"
            }
        ]
    })

    res.json(propiedades)
}

const obtenerPropiedadesFiltradas = async (req, res) => {
    const { estado, categoria, habitaciones, wc, estacionamiento, buscar } = req.query
    
    // Construir el objeto where
    const where = {}
    
    // Filtro por estado (publicado/no publicado)
    if (estado !== undefined && estado !== '') {
        where.publicado = estado === '1' ? true : false
    }
    
    // Filtro por categoría
    if (categoria && categoria !== '') {
        where.categoriaId = categoria
    }
    
    // Filtro por habitaciones
    if (habitaciones && habitaciones !== '') {
        if (habitaciones === '5') {
            where.habitaciones = { [Op.gte]: 5 }
        } else {
            where.habitaciones = habitaciones
        }
    }
    
    // Filtro por baños
    if (wc && wc !== '') {
        if (wc === '5') {
            where.wc = { [Op.gte]: 5 }
        } else {
            where.wc = wc
        }
    }
    
    // Filtro por estacionamientos
    if (estacionamiento && estacionamiento !== '') {
        if (estacionamiento === '5') {
            where.estacionamiento = { [Op.gte]: 5 }
        } else {
            where.estacionamiento = estacionamiento
        }
    }
    
    // Filtro por búsqueda en título
    if (buscar && buscar.trim() !== '') {
        where.titulo = { [Op.iLike]: `%${buscar.trim()}%` }
    }
    
    try {
        const propiedades = await Propiedad.findAll({
            where,
            include: [
                {
                    model: Categoria,
                    as: "categoriaRelacion"
                },
                {
                    model: Usuario,
                    as: "usuarioRelacion"
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        
        res.json(propiedades)
    } catch (error) {
        console.error('Error al obtener propiedades filtradas:', error)
        res.status(500).json({ error: 'Error al obtener propiedades filtradas' })
    }
}

const obtenerPropiedadesCategoria = async (req, res) => {
    const { id } = req.params
    try {
        const propiedades = await Propiedad.findAll({
            where: {
                categoriaId: id,
                publicado: true
            },
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
        res.json(propiedades)
    } catch (error) {
        console.error('Error al obtener propiedades por categoría:', error)
        res.status(500).json({ error: 'Error al obtener propiedades por categoría' })
    }
}

const obtenerFavoritos = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const favoritos = await Favorito.findAll({
        where : {
            usuarioId : id
        }
    })
    res.json(favoritos)
}

export {
    obtenerPropiedades, 
    obtenerPropiedadesCategoria,
    obtenerFavoritos,
    obtenerPropiedadesAdmin,
    obtenerPropiedadesFiltradas
}