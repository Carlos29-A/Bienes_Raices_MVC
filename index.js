import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import db from './config/db.js'
import authRouter from './routes/usuriosRoute.js'
import propiedadesRouter from './routes/propiedadRoute.js'
import { Usuario, Propiedad, Categoria, Favorito, Mensaje, ComentarioCalificacion } from './models/index.js'
import favoritosRouter from './routes/favoritosRoute.js'
import mensajeRouter from './routes/mensajeRoute.js'
import apiRoute from './routes/apiRoute.js'
import comentarioCalificacionRouter from './routes/ComentarioCalificacion.js'
import administradorRouter from './routes/administradorRoute.js'
import publicoRoute from './routes/publicRoute.js'
import flash from 'connect-flash'
import session from 'express-session'
import { Op } from 'sequelize'

// Cargar variables de entorno
dotenv.config({ path: '.env' })

// Verificar la carga de variables de entorno
console.log('Verificando variables de entorno:')
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Configurada' : 'No configurada')
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY)
console.log('PORT:', process.env.PORT || 3000)

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

// Configuración de Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_bienes_raices',
    resave: false,
    saveUninitialized: false,
}))

// Configuración de Flash Messages
app.use(flash())

// Habilitar CSRF después de cookie-parser y session
app.use(csrf({ cookie: true }))

// Middleware para variables locales
app.use((req, res, next) => {
    // Variables locales para mensajes flash
    res.locals.mensajesFlash = req.flash('mensajeFlash')
    res.locals.tipoFlash = req.flash('tipoFlash')[0]
    res.locals.csrfToken = req.csrfToken() // Hacer disponible el token CSRF globalmente
    res.locals.openrouterKey = process.env.OPENROUTER_API_KEY || '' // Hacer disponible la clave API globalmente
    next()
})

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta pública
app.use(express.static('./public'))

// Middleware para pasar las categorias a la vista
app.use(async (req, res, next) => {
    try {
        const propiedades = await Propiedad.findAll()
        const categorias = await Categoria.findAll()
        res.locals.categorias = categorias
        res.locals.propiedades = propiedades
        next()
    } catch (error) {
        next(error)
    }
})

// Rutas
app.use('/auth', authRouter)
app.use(async (req, res, next) => {
    // Usuarios
    const usuarios = await Usuario.findAll({ where: { tipo: { [Op.or]: [1, 2] } } })
    // Propiedades
    const propiedades = await Propiedad.findAll()
    // Mensajes
    const mensajes = await Mensaje.findAll()
    // Categorias
    const categorias = await Categoria.findAll()
    res.locals.usuarios = usuarios
    res.locals.propiedades = propiedades
    res.locals.mensajes = mensajes
    res.locals.categorias = categorias
    next()
})
app.use('/auth/administrador', administradorRouter)
app.use('/propiedades', propiedadesRouter)
app.use('/favoritos', favoritosRouter)
app.use('/mensajes', mensajeRouter)
app.use('/api', apiRoute)
app.use('/comentario-calificacion', comentarioCalificacionRouter)
app.use('/', publicoRoute)

// Puerto
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
