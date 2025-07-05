import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Contacto = db.define('contactos', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    tipo_usuario: {
        type: DataTypes.ENUM('registrado', 'no_registrado'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    categoria: {
        type: DataTypes.ENUM('error_tecnico', 'reporte_contenido', 'cuenta', 'publicacion', 'sugerencia', 'planes', 'otro'),
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 100]
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [20, 1000]
        }
    },
    archivos_adjuntos: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto'),
        defaultValue: 'pendiente'
    }
})

export default Contacto 