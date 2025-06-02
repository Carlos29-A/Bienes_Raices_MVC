import { Usuario, Favorito, Propiedad, Categoria } from '../models/index.js'

const agregarFavorito = async (req, res) => {
    const { id: usuarioId } = req.usuario
    const usuario = await Usuario.findByPk(usuarioId)

    if (!usuario) {
        return res.redirect('/auth/login')
    }

    // Eliminar el favorito si ya existe
    const favoritoExistente = await Favorito.findOne({
        where: {
            usuarioId: usuario.id,
            propiedadId: req.params.id
        }
    })

    if (favoritoExistente) {
        await favoritoExistente.destroy()
        return res.json({
            resultado: true,
            accion: 'eliminado'
        })
    }

    const { id: propiedadId } = req.params

    const favorito = await Favorito.create({
        usuarioId: usuario.id,
        propiedadId: propiedadId
    })

    res.json({
        resultado: true,
        accion: 'agregado'
    })
}


const favoritos = async (req, res) => {
    const { id } = req.usuario
    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.redirect('/auth/login')
    }

    const favoritos = await Favorito.findAll({
        where: {
            usuarioId: usuario.id
        },
        include: [
            {
                model: Propiedad,
                as: 'propiedadRelacion',
                include: [
                    {
                        model: Usuario,
                        as: 'usuarioRelacion'
                    },
                    {
                        model: Categoria,
                        as: 'categoriaRelacion'
                    }
                ]
            }
        ]
    })

    res.render('propiedades/favoritos', {
        usuario,
        csrfToken: req.csrfToken(),
        favoritos,
        ruta: '/favoritos/propiedades-favoritas'
    })
}

export {
    favoritos,
    agregarFavorito
}