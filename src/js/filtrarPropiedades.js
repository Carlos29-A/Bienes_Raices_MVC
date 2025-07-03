// Esperar a que la página cargue
document.addEventListener('DOMContentLoaded', function() {
    const selectEstado = document.getElementById('estado_select')
    const selectCategoria = document.getElementById('categoria_select')
    const selectHabitaciones = document.getElementById('habitaciones_select')
    const selectWc = document.getElementById('wc_select')
    const selectEstacionamiento = document.getElementById('estacionamiento_select')
    const buscarInput = document.getElementById('buscar_input')
    const limpiarFiltros = document.getElementById('limpiar_filtros')
    const contenedor = document.getElementById('lista_propiedades')
    const contadorPropiedades = document.getElementById('contador_propiedades')
    
    // Elementos para mostrar/ocultar filtros
    const toggleFiltrosBtn = document.getElementById('toggleFiltros')
    const filtrosContainer = document.getElementById('filtrosContainer')
    const cerrarFiltrosBtn = document.getElementById('cerrarFiltros')
    const toggleIcon = toggleFiltrosBtn?.querySelector('.fa-chevron-down')

    // Función para mostrar filtros
    function mostrarFiltros() {
        if (filtrosContainer) {
            filtrosContainer.classList.remove('hidden')
            filtrosContainer.style.display = 'block'
            
            // Animación suave
            setTimeout(() => {
                filtrosContainer.style.opacity = '1'
                filtrosContainer.style.transform = 'translateY(0)'
            }, 10)
        }
        
        if (toggleFiltrosBtn) {
            const span = toggleFiltrosBtn.querySelector('span')
            if (span) span.textContent = 'Ocultar Filtros'
        }
        
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(180deg)'
        }
    }

    // Función para ocultar filtros
    function ocultarFiltros() {
        if (filtrosContainer) {
            filtrosContainer.style.opacity = '0'
            filtrosContainer.style.transform = 'translateY(-10px)'
            
            setTimeout(() => {
                filtrosContainer.classList.add('hidden')
                filtrosContainer.style.display = 'none'
            }, 200)
        }
        
        if (toggleFiltrosBtn) {
            const span = toggleFiltrosBtn.querySelector('span')
            if (span) span.textContent = 'Mostrar Filtros'
        }
        
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(0deg)'
        }
    }

    // Event listeners para mostrar/ocultar filtros
    if (toggleFiltrosBtn) {
        toggleFiltrosBtn.addEventListener('click', () => {
            if (filtrosContainer.classList.contains('hidden')) {
                mostrarFiltros()
            } else {
                ocultarFiltros()
            }
        })
    }

    if (cerrarFiltrosBtn) {
        cerrarFiltrosBtn.addEventListener('click', ocultarFiltros)
    }

    // Función para crear el HTML de una propiedad
    function crearPropiedadHTML(propiedad) {
        const estado = propiedad.publicado ? 'Publicado' : 'No Publicado';
        const colorEstado = propiedad.publicado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

        return `
            <li class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 mb-4 overflow-hidden">
                <div class="p-6">
                    <div class="flex gap-6">
                        <!-- Imagen -->
                        <div class="flex-shrink-0 flex justify-center items-center">
                            <img src="/uploads/${propiedad.imagen}" alt="Casa" class="w-48 h-48 rounded-lg object-cover shadow-sm">
                        </div>
                        
                        <!-- Contenido principal -->
                        <div class="flex-1 min-w-0">
                            <!-- Header con título y precio -->
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-gray-900 mb-1 truncate">${propiedad.titulo}</h3>
                                    <p class="text-2xl font-bold text-[#F99E00]">$ ${propiedad.precio.toLocaleString('es-CO')}</p>
                                </div>
                                
                                <!-- Estado de la propiedad -->
                                <div class="flex items-center gap-2 ml-4">
                                    <div class="w-3 h-3 rounded-full ${estado === 'Publicado' ? 'bg-green-500' : 'bg-gray-400'}"></div>
                                    <span class="text-sm font-medium ${estado === 'Publicado' ? 'text-green-600' : 'text-gray-500'}">${estado === 'Publicado' ? 'Publicado' : 'No Publicado'}</span>
                                </div>
                            </div>
                            
                            <!-- Información de ubicación -->
                            <div class="flex items-center gap-4 mb-3">
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-map-marker-alt text-[#F99E00]"></i>
                                    <span class="text-sm">${propiedad.categoriaRelacion.nombre}</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-location-arrow text-[#F99E00]"></i>
                                    <span class="text-sm">${propiedad.calle}</span>
                                </div>
                            </div>
                            
                            <!-- Características de la propiedad -->
                            <div class="flex items-center gap-6 mb-4">
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-bed text-[#F99E00]"></i>
                                    <span class="text-sm font-medium">${propiedad.habitaciones} habitaciones</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-bath text-[#F99E00]"></i>
                                    <span class="text-sm font-medium">${propiedad.wc} baños</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-car text-[#F99E00]"></i>
                                    <span class="text-sm font-medium">${propiedad.estacionamiento} estacionamientos</span>
                                </div>
                            </div>
                            
                            <!-- Botones de acción -->
                            <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
                                <!-- Cambiar estado -->
                                <button 
                                    class="cambiar-estado flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${estado === 'Publicado' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} cursor-pointer"
                                    data-propiedad-id="${propiedad.id}"
                                >
                                    <img src="${estado === 'Publicado' ? '/img/activarPropiedad.png' : '/img/desactivarPropiedad.png'}" 
                                         alt="${estado === 'Publicado' ? 'Activar' : 'Desactivar'}" 
                                         class="w-12 h-12">
                                    ${estado === 'Publicado' ? 'Desactivar' : 'Activar'}
                                </button>
                                
                                <!-- Editar -->
                                <a href="/propiedades/editar/${propiedad.id}" 
                                   class="flex items-center gap-2 px-4 py-2 bg-[#F99E00] text-white rounded-lg text-sm font-medium hover:bg-[#F97101] transition-all duration-200 cursor-pointer">
                                    <img src="/img/editarPropiedad.png" alt="Editar" class="w-12 h-12">
                                    Editar
                                </a>
                                
                                <!-- Eliminar -->
                                <button type="button" 
                                        class="eliminar-propiedad flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all duration-200 cursor-pointer" 
                                        data-propiedad-id="${propiedad.id}"
                                        data-propiedad-titulo="${propiedad.titulo}">
                                    <img src="/img/eliminarPropiedad.png" alt="Eliminar" class="w-12 h-12">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }

    // Función para mostrar modal de eliminación
    function mostrarModalEliminarPropiedad(propiedadId, propiedadTitulo) {
        const modalEliminar = document.getElementById('modalEliminar');
        if (!modalEliminar) return;

        modalEliminar.classList.add('flex');
        modalEliminar.classList.remove('hidden');

        // Mostrar el nombre de la propiedad
        const nombrePropiedad = document.getElementById('nombrePropiedad');
        if (nombrePropiedad) {
            nombrePropiedad.textContent = propiedadTitulo;
        }

        // Actualizar la acción del formulario
        const formEliminar = document.getElementById('formEliminar');
        if (formEliminar) {
            formEliminar.action = `/propiedades/eliminar/${propiedadId}`;
        }

        // Mostrar el modal con animación
        setTimeout(() => {
            const modalContent = modalEliminar.querySelector('.bg-white');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);
    }

    // Función para cerrar modal de eliminación
    function cerrarModalEliminarPropiedad() {
        const modalEliminar = document.getElementById('modalEliminar');
        if (!modalEliminar) return;

        const modalContent = modalEliminar.querySelector('.bg-white');
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }

        setTimeout(() => {
            modalEliminar.classList.add('hidden');
            modalEliminar.classList.remove('flex');
        }, 300);
    }

    // Función para mostrar las propiedades en la página
    function mostrarPropiedades(propiedades) {
        if (propiedades.length === 0) {
            contenedor.innerHTML = '<li class="p-8 text-center text-gray-500"><i class="fas fa-search text-4xl mb-4 text-gray-300"></i><p>No hay propiedades que coincidan con los filtros</p></li>'
            contadorPropiedades.textContent = '0';
            return
        }

        // Crear el HTML de todas las propiedades
        const html = propiedades.map(propiedad => crearPropiedadHTML(propiedad)).join('')
        contenedor.innerHTML = html
        contadorPropiedades.textContent = propiedades.length;

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

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll('.eliminar-propiedad').forEach(boton => {
            boton.addEventListener('click', () => {
                const propiedadId = boton.dataset.propiedadId;
                const propiedadTitulo = boton.dataset.propiedadTitulo;
                mostrarModalEliminarPropiedad(propiedadId, propiedadTitulo);
            });
        })
    }

    // Función para obtener las propiedades filtradas
    async function obtenerPropiedadesFiltradas() {
        try {
            // Construir los parámetros de búsqueda
            const params = new URLSearchParams()

            // Agregar todos los filtros
            if (selectEstado.value !== '') {
                params.append('estado', selectEstado.value)
            }
            if (selectCategoria.value !== '') {
                params.append('categoria', selectCategoria.value)
            }
            if (selectHabitaciones.value !== '') {
                params.append('habitaciones', selectHabitaciones.value)
            }
            if (selectWc.value !== '') {
                params.append('wc', selectWc.value)
            }
            if (selectEstacionamiento.value !== '') {
                params.append('estacionamiento', selectEstacionamiento.value)
            }
            if (buscarInput.value.trim() !== '') {
                params.append('buscar', buscarInput.value.trim())
            }
            
            const url = `/propiedades/api/propiedades/filtradas?${params.toString()}`
            console.log('URL de búsqueda:', url)

            // Obtener las propiedades
            const respuesta = await fetch(url)
            const propiedades = await respuesta.json()
            console.log('Propiedades recibidas:', propiedades)
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log('Error al obtener propiedades:', error)
        }
    }

    // Función para limpiar filtros
    function limpiarTodosLosFiltros() {
        selectEstado.value = ''
        selectCategoria.value = ''
        selectHabitaciones.value = ''
        selectWc.value = ''
        selectEstacionamiento.value = ''
        buscarInput.value = ''
        obtenerPropiedadesFiltradas()
    }

    // Agregar eventos a los selectores
    selectEstado.addEventListener('change', obtenerPropiedadesFiltradas)
    selectCategoria.addEventListener('change', obtenerPropiedadesFiltradas)
    selectHabitaciones.addEventListener('change', obtenerPropiedadesFiltradas)
    selectWc.addEventListener('change', obtenerPropiedadesFiltradas)
    selectEstacionamiento.addEventListener('change', obtenerPropiedadesFiltradas)
    buscarInput.addEventListener('input', obtenerPropiedadesFiltradas)
    limpiarFiltros.addEventListener('click', limpiarTodosLosFiltros)

    // Cargar propiedades al inicio
    obtenerPropiedadesFiltradas()

    // Hacer las funciones globales
    window.mostrarModalEliminarPropiedad = mostrarModalEliminarPropiedad;
    window.cerrarModalEliminarPropiedad = cerrarModalEliminarPropiedad;
})
