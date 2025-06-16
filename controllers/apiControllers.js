import { Propiedad, Categoria, Usuario, Favorito } from "../models/index.js"

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
    obtenerPropiedadesAdmin
}