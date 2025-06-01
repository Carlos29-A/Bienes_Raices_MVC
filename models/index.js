import Usuario from './Usuario.js'
import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Favorito from './Favorito.js'
import Mensaje from './Mensaje.js'


// Relaciones
Propiedad.belongsTo(Categoria, { as: 'categoriaRelacion', foreignKey: 'categoriaId' })
Propiedad.belongsTo(Usuario, { as: 'usuarioRelacion', foreignKey: 'usuarioId' })
Favorito.belongsTo(Usuario, { as: 'usuarioRelacion', foreignKey: 'usuarioId' })
Favorito.belongsTo(Propiedad, { as: 'propiedadRelacion', foreignKey: 'propiedadId' })
Mensaje.belongsTo(Usuario, { as: 'remitenteRelacion', foreignKey: 'remitenteId' })
Mensaje.belongsTo(Usuario, { as: 'destinatarioRelacion', foreignKey: 'destinatarioId' })
Mensaje.belongsTo(Propiedad, { as: 'propiedadRelacion', foreignKey: 'propiedadId' })

export {
    Usuario,
    Propiedad,
    Categoria,
    Favorito,
    Mensaje
}
