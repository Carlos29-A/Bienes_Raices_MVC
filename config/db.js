import sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const db = new sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

export default db
