import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"


const protegerRuta = async (req, res, next) => {
    const token = req.cookies._token
    // Verificar si el token existe
    if (!token) {
        return res.redirect('/auth/login')
    }
    // Comprobar el token
    try {
        const decoded = jwt.verify(token, "llavesecretaaaaa")
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
    }
}

export default protegerRuta