import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ComentarioCalificacion = db.define('ComentarioCalificacion', {

    calificacion : {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    },
    comentario : {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

export default ComentarioCalificacion