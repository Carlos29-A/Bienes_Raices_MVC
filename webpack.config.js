import path from 'path'

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        cambiarEstado: './src/js/cambiarEstado.js',
        filtrarPropiedades: './src/js/filtrarPropiedades.js',
        agregarFavorito: './src/js/agregarFavorito.js',
        mapaComprador: './src/js/mapaComprador.js',
        filtrar: './src/js/filtrar.js',
        filtrosAdmin: './src/js/filtrosAdmin.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}