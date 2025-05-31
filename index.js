import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })


const app = express()




// Ventana
app.get('/', (req, res) => {
    res.send('Hola Mundo')
})

// Activar el servidor
app.listen(process.env.PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${process.env.PORT}`)
})
