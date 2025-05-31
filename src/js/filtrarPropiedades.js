// Esperar a que la página cargue
document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos del HTML que necesitamos
    const selectEstado = document.getElementById('estado_select')
    const selectCategoria = document.getElementById('categoria_select')
    const contenedor = document.querySelector('.divide-y.divide-gray-200')

    // Función para crear el HTML de una propiedad
    function crearHTMLPropiedad(propiedad) {
        const estado = propiedad.publicado ? 'Publicado' : 'No Publicado'
        const colorEstado = propiedad.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-red-800'

        return `
            <li class="border-b border-gray-200">
                <div class="p-4 flex justify-between items-center">
                    <!-- Imagen y detalles -->
                    <div class="flex">
                        <img src="/uploads/${propiedad.imagen}" alt="Casa" class="w-50 h-30 rounded-lg object-cover">
                        <div class="ml-4">
                            <h3 class="text-lg font-bold">${propiedad.titulo}</h3>
                            <p class="text-gray-600 font-bold">$ ${propiedad.precio}</p>
                            <div class="flex items-center space-x-2">
                                <p class="text-gray-600"><i class="fas fa-map-marker-alt"></i> ${propiedad.categoriaRelacion.nombre}</p>
                                <p class="text-gray-600"><i class="fas fa-location-arrow"></i> ${propiedad.calle}</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <p class="text-gray-600"><i class="fas fa-bed"></i> ${propiedad.habitaciones} habitaciones</p>
                                <p class="text-gray-600"><i class="fas fa-bath"></i> ${propiedad.wc} baños</p>
                                <p class="text-gray-600"><i class="fas fa-car"></i> ${propiedad.estacionamiento} estacionamientos</p>
            
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="mt-4 flex gap-2">
                        <button 
                            class="cambiar-estado px-3 py-1 rounded-full ${colorEstado}"
                            data-propiedad-id="${propiedad.id}"
                        >
                            ${estado}
                        </button>
                        <a href="/propiedades/editar/${propiedad.id}" class="text-blue-600">
                            <i class="fas fa-edit"></i> Editar
                        </a>
                        <form action="/propiedades/eliminar/${propiedad.id}" method="POST" class="inline">
                            <input type="hidden" name="_csrf" value="${document.querySelector('meta[name="csrf-token"]').getAttribute('content')}">
                            <button type="submit" class="text-red-600" onclick="return confirm('¿Eliminar esta propiedad?')">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </form>
                    </div>
                </div>
            </li>
        `
    }

    // Función para mostrar las propiedades en la página
    function mostrarPropiedades(propiedades) {
        if (propiedades.length === 0) {
            contenedor.innerHTML = '<li class="p-4 text-center text-gray-500">No hay propiedades que coincidan con los filtros</li>'
            return
        }

        // Crear el HTML de todas las propiedades
        const html = propiedades.map(propiedad => crearHTMLPropiedad(propiedad)).join('')
        contenedor.innerHTML = html

        // Agregar eventos a los botones de estado
        document.querySelectorAll('.cambiar-estado').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.dataset.propiedadId
                const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

                try {
                    // Enviar petición para cambiar el estado
                    const respuesta = await fetch(`/propiedades/estado/${id}`, {
                        method: 'PUT',
                        headers: { 'CSRF-Token': token }
                    })
                    const resultado = await respuesta.json()

                    // Actualizar el botón si la petición fue exitosa
                    if (resultado.resultado) {
                        if (boton.classList.contains('bg-green-100')) {
                            boton.classList.remove('bg-green-100', 'text-green-800')
                            boton.classList.add('bg-yellow-100', 'text-red-800')
                            boton.textContent = 'No Publicado'
                        } else {
                            boton.classList.remove('bg-yellow-100', 'text-red-800')
                            boton.classList.add('bg-green-100', 'text-green-800')
                            boton.textContent = 'Publicado'
                        }
                    }
                } catch (error) {
                    console.log('Error al cambiar estado:', error)
                }
            })
        })
    }

    // Función para obtener las propiedades filtradas
    async function obtenerPropiedadesFiltradas() {
        try {
            // Construir la URL con los filtros
            const url = new URL('/propiedades/api/propiedades', window.location.origin)

            // Siempre enviar el estado, incluso si es 0
            url.searchParams.append('estado', selectEstado.value)

            // Siempre enviar la categoría, incluso si es 0
            url.searchParams.append('categoria', selectCategoria.value)

            console.log('URL de búsqueda:', url.toString())

            // Obtener las propiedades
            const respuesta = await fetch(url)
            const propiedades = await respuesta.json()
            console.log('Propiedades recibidas:', propiedades)
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log('Error al obtener propiedades:', error)
        }
    }

    // Agregar eventos a los selectores
    selectEstado.addEventListener('change', obtenerPropiedadesFiltradas)
    selectCategoria.addEventListener('change', obtenerPropiedadesFiltradas)

    // Cargar propiedades al inicio
    obtenerPropiedadesFiltradas()
})
