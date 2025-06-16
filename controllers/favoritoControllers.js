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

    // Filtros
    const { categoria, habitaciones, baños, estacionamiento } = req.query

    let filtro ={
    }

    if(categoria){
        filtro.categoriaId = parseInt(categoria)
    }

    if(habitaciones){
        filtro.habitaciones = parseInt(habitaciones)
    }

    if(baños){
        filtro.wc = parseInt(baños)
    }

    if(estacionamiento){
        filtro.estacionamiento = parseInt(estacionamiento)
    }

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
                where: filtro,
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