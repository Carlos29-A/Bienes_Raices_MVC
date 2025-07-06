import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        mapaComprador: './src/js/mapaComprador.js',
        mapaPublico: './src/js/mapaPublico.js',
        agregarFavorito: './src/js/agregarFavorito.js',
        cambiarEstado: './src/js/cambiarEstado.js',
        filtrar: './src/js/filtrar.js',
        filtrarPropiedades: './src/js/filtrarPropiedades.js',
        filtrosAdmin: './src/js/filtrosAdmin.js',
        accesibilidad: './src/js/accesibilidad.js',
        audio: './src/js/audio.js',
        agregarVentanaModal: './src/js/agregarVentanaModal.js',
        notificaciones: './src/js/notificaciones.js',
        chatBot: './src/js/chatBot.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js')
    }
}