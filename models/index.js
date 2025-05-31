import Usuario from './Usuario.js'
import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Favorito from './Favorito.js'


// Relaciones
Propiedad.belongsTo(Categoria, { as: 'categoriaRelacion', foreignKey: 'categoriaId' })
Propiedad.belongsTo(Usuario, { as: 'usuarioRelacion', foreignKey: 'usuarioId' })
Favorito.belongsTo(Usuario, { as: 'usuarioRelacion', foreignKey: 'usuarioId' })
Favorito.belongsTo(Propiedad, { as: 'propiedadRelacion', foreignKey: 'propiedadId' })


export {
    Usuario,
    Propiedad,
    Categoria,
    Favorito
}
