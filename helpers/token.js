import jwt from 'jsonwebtoken'
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32)
const generarJWT = (datos) => jwt.sign(
    { id: datos.id, nombre: datos.nombre, email: datos.email, tipo: datos.tipo }, "llavesecretaaaaa", { expiresIn: '1d' })

export {
    generarId,
    generarJWT
}