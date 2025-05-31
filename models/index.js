import Usuario from './Usuario.js'
import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'



// Relaciones
Propiedad.belongsTo(Categoria, { as: 'categoriaRelacion', foreignKey: 'categoriaId' })
Propiedad.belongsTo(Usuario, { as: 'usuarioRelacion', foreignKey: 'usuarioId' })





export {
    Usuario,
    Propiedad,
    Categoria
}
