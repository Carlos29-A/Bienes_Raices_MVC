(function () {
    const categoriaId = document.querySelector('#categoria')
    const habitaciones = document.querySelector('#habitaciones')
    const baños = document.querySelector('#baños')
    const estacionamiento = document.querySelector('#estacionamiento')
    const propiedadesContenedor = document.querySelector('.propiedades-contenedor')
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    let propiedades = []

    const filtrarPropiedades = {
        habitaciones: '',
        baños: '',
        estacionamiento: '',
        categoriaId: ''
    }

    // Eventos
    categoriaId.addEventListener('change', (e) => {
        filtrarPropiedades.categoriaId = +e.target.value
        filtrarPropiedadesFuncion()
    })

    habitaciones.addEventListener('change', (e) => {
        filtrarPropiedades.habitaciones = +e.target.value
        filtrarPropiedadesFuncion()
    })

    baños.addEventListener('change', (e) => {
        filtrarPropiedades.baños = +e.target.value
        filtrarPropiedadesFuncion()
    })

    estacionamiento.addEventListener('change', (e) => {
        filtrarPropiedades.estacionamiento = +e.target.value
        filtrarPropiedadesFuncion()
    })

    //obtener propiedades
    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades/admin'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            console.log(propiedades)
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }

    const filtrarPropiedadesFuncion = () => {
        const propiedadesFiltradas = propiedades.filter(filtrarHabitaciones).filter(filtrarBaños).filter(filtrarEstacionamiento).filter(filtrarCategoria)
        mostrarPropiedades(propiedadesFiltradas)
    }

    const filtrarHabitaciones = (propiedad) => {
        return filtrarPropiedades.habitaciones ? propiedad.habitaciones === filtrarPropiedades.habitaciones : propiedad
    }
    const filtrarBaños = (propiedad) => {
        return filtrarPropiedades.baños ? propiedad.wc === filtrarPropiedades.baños : propiedad
    }
    const filtrarEstacionamiento = (propiedad) => {
        return filtrarPropiedades.estacionamiento ? propiedad.estacionamiento === filtrarPropiedades.estacionamiento : propiedad
    }
    const filtrarCategoria = (propiedad) => {
        return filtrarPropiedades.categoriaId ? propiedad.categoriaId === filtrarPropiedades.categoriaId : propiedad
    }



    // Función simple para eliminar
    window.eliminarPropiedad = function (id) {

        //- Actualizar el action del formulario
        document.getElementById('formEliminarPropiedad').action = `/auth/administrador/propiedades/eliminar/${id}`

        //- Mostrar el modal con animación
        const modal = document.getElementById('modalEliminarPropiedad')
        modal.classList.remove('hidden')

        setTimeout(() => {
            modal.querySelector('.bg-white').classList.remove('scale-95', 'opacity-0')
            modal.querySelector('.bg-white').classList.add('scale-100', 'opacity-100')
        }, 10)
    }


    //- Cerrar el modal
    window.cerrarModalEliminarPropiedad = function () {
        const modal = document.getElementById('modalEliminarPropiedad')
        const modalContent = modal.querySelector('.bg-white')
        // Animacion de salida
        modalContent.classList.remove('scale-100', 'opacity-100')
        modalContent.classList.add('scale-95', 'opacity-0')

        //- Esperar a que termine la animación
        setTimeout(() => {
            modal.classList.add('hidden')
        }, 300)
    }

    //- Cerrar el modal al hacer click fuera del modal
    document.getElementById('modalEliminarPropiedad').addEventListener('click', (e) => {
        if (e.target.id === 'modalEliminarPropiedad') {
            cerrarModalEliminarPropiedad()
        }
    })

    const mostrarPropiedades = (propiedades) => {

        //limpiar el contenedor
        propiedadesContenedor.innerHTML = ''

        if (propiedades.length === 0) {
            propiedadesContenedor.innerHTML = `
                <p class="text-center text-gray-600 text-2xl font-bold">No hay propiedades disponibles</p>
            `
            return
        }
        //mostrar las propiedades
        propiedades.forEach(propiedad => {
            propiedadesContenedor.innerHTML += `
                <article class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div class="relative h-48 group">
                        <img 
                            src="/uploads/${propiedad.imagen}"
                            alt="${propiedad.titulo}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div class="absolute top-4 right-4">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${propiedad.publicado
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }">
                                ${propiedad.publicado ? 'Publicada' : 'No Publicada'}
                            </span>
                        </div>
                    </div>

                    <div class="p-4">
                        <div class="mb-3">
                            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">${propiedad.titulo}</h3>
                            <p class="text-sm text-[#FF6819] font-medium">
                                ${propiedad.categoriaRelacion ? propiedad.categoriaRelacion.nombre : 'Sin categoría'}
                            </p>
                        </div>

                        <p class="text-xl font-bold text-[#FF6819] mb-3">
                            $ ${propiedad.precio.toLocaleString()}
                        </p>

                        <div class="grid grid-cols-3 gap-2 mb-4">
                            <div class="flex items-center text-sm text-gray-600">
                                <i class="fas fa-bed mr-1.5"></i>
                                <span>${propiedad.habitaciones} hab</span>
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <i class="fas fa-bath mr-1.5"></i>
                                <span>${propiedad.wc} baños</span>
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <i class="fas fa-car mr-1.5"></i>
                                <span>${propiedad.estacionamiento} est</span>
                            </div>
                        </div>

                        <div class="flex items-center text-sm text-gray-600 mb-4">
                            <i class="fas fa-map-marker-alt mr-1.5"></i>
                            <span class="truncate">${propiedad.calle}</span>
                        </div>

                        <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div class="flex items-center space-x-2">
                                <img 
                                    src="/img/avatar.png" 
                                    alt="${propiedad.usuarioRelacion.nombre}" 
                                    class="w-8 h-8 rounded-full"
                                />
                                <p class="text-sm text-gray-600">${propiedad.usuarioRelacion.nombre}</p>
                            </div>

                            <div class="flex space-x-2">
                                <a 
                                    href="/auth/administrador/propiedades/editar/${propiedad.id}"
                                    class="inline-flex items-center px-3 py-1.5 text-sm text-[#FF6819] hover:bg-orange-50 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                    <i class="fas fa-edit mr-1.5"></i>
                                    Editar
                                </a>
                                <button
                                    class="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                                    onclick="eliminarPropiedad('${propiedad.id}')"
                                >
                                    <i class="fas fa-trash-alt mr-1.5"></i>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `
        })
    }

    obtenerPropiedades()
})()