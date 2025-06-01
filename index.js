import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import db from './config/db.js'
import authRouter from './routes/usuriosRoute.js'
import propiedadesRouter from './routes/propiedadRoute.js'
import { Usuario, Propiedad, Categoria, Favorito, Mensaje } from './models/index.js'
import favoritosRouter from './routes/favoritosRoute.js'
import mensajeRouter from './routes/mensajeRoute.js'

dotenv.config()

// Configuración de la aplicación
const app = express()


try {
    await db.authenticate()
    await db.sync()
    console.log('Conexión a la base de datos establecida correctamente')
} catch (error) {
    console.log(error)
}

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(csrf({ cookie: true }))

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta pública
app.use(express.static('./public'))

// Middleware para pasar las categorias a la vista
app.use(async (req, res, next) => {
    try {
        const categorias = await Categoria.findAll()
        res.locals.categorias = categorias
        next()
    } catch (error) {
        next(error)
    }
})

// Rutas
app.use('/auth', authRouter)
app.use('/propiedades', propiedadesRouter)
app.use('/favoritos', favoritosRouter)
app.use('/mensajes', mensajeRouter)

// Puerto
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
