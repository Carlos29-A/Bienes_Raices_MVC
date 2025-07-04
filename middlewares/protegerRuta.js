import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

const protegerRuta = async (req, res, next) => {
    // Verificar si el token existe
    const token = req.cookies._token
    if (!token) {
        return res.redirect('/auth/login')
    }

    // Comprobar el token
    try {
        const decoded = jwt.verify(token, "llavesecretaaaaa")
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        if (!usuario) {
            return res.redirect('/auth/login')
        }

        // Agregar el usuario al request
        req.usuario = usuario
        return next()
    } catch (error) {
        console.log(error)
        // Limpiar la cookie del token
        res.clearCookie('_token')
        return res.redirect('/auth/login')
    }
}


const validarAdministrador = async (req, res, next) => {
    const { id } = req.usuario
    const administrador = await Usuario.findOne({ where: { id } })

    if(!administrador || administrador.tipo !== '3'){
        return res.redirect('/auth/login')
    }

    return next()
}

const validarVendedor = async (req, res, next) => {
    const { id } = req.usuario
    const vendedor = await Usuario.findOne({ where: { id } })

    if(!vendedor || vendedor.tipo !== '1'){
        return res.redirect('/auth/login')
    }

    return next()
}

const validarComprador = async (req, res, next) => {
    const { id } = req.usuario
    const comprador = await Usuario.findOne({ where: { id } })

    if(!comprador || comprador.tipo !== '2'){
        return res.redirect('/auth/login')
    }

    return next()
}

export {
    protegerRuta,
    validarAdministrador,
    validarVendedor,
    validarComprador
}