import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import usuariosRoutes from './routes/usuriosRoute.js'
import db from './config/db.js'

dotenv.config({ path: '.env' })

// Creamos el servidor
const app = express()

// Conectar a la base de datos
try {
    await db.authenticate()
    // Usar alter para modificar la base de datos sin perder los datos
    await db.sync({ alter: true })
    console.log('Conectado a la base de datos')
} catch (error) {
    console.log('Error al conectar a la base de datos')
    console.log(error)
}

// Habilitar que se pueda leer los datos del formulario
app.use(express.urlencoded({ extended: true }))

// Habilitamos cookies
app.use(cookieParser())

// Habilitamos csrf
app.use(csrf({ cookie: true }))

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta Publica
app.use(express.static('public'))

// Routing
app.use('/auth', usuariosRoutes)


// Ventana
app.get('/', (req, res) => {
    res.send('Hola Mundo')
})



// Activar el servidor
app.listen(process.env.PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${process.env.PORT}`)
})
