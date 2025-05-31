import { Categoria } from '../models/index.js'
import categorias from './categorias.js'
import db from '../config/db.js'

const importCategorias = async () => {
    try {
        // Autenticar
        await db.authenticate()
        // Generamos las columnas
        await db.sync({ force: true })
        // Importamos las categorias
        await Categoria.bulkCreate(categorias)
        console.log('Categorias importadas correctamente')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


if (process.argv[2] === 'categorias') {
    importCategorias()
}
