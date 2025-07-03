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


export default protegerRuta