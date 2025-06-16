(function(){
    const categoriaId = document.querySelector('.categoriaId')
    const habitaciones = document.querySelector('#habitaciones')
    const baños = document.querySelector('#baños')
    const estacionamiento = document.querySelector('#estacionamiento')
    const propiedadesContenedor = document.querySelector('.propiedades-contenedor')
    const idUsuario = document.querySelector('.idUsuario')

    let propiedades = []
    let favoritos = []
    const filtrarPropiedades = {
        habitaciones: '',
        baños: '',
        estacionamiento: ''
    }
    // Eventos
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

    const filtrarPropiedadesFuncion = () => {
        const resultado = propiedades.filter(filtrarHabitaciones).filter(filtrarBaños).filter(filtrarEstacionamiento)
        console.log(resultado)
        mostrarPropiedades(resultado)
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

    // Recogemos las propiedades
    const obtenerPropiedades = async () => {
        try {
            const respuesta = await fetch(`/api/propiedades/categoria/${categoriaId.textContent}`)
            propiedades = await respuesta.json()
            if (!Array.isArray(propiedades)) {
                throw new TypeError("La respuesta no es un array de propiedades")
            }

            mostrarPropiedades(propiedades)
        } catch (error) {
            console.error('Error al obtener las propiedades:', error)
            propiedadesContenedor.innerHTML = `
                <div class="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                    <p class="font-medium">Error al cargar las propiedades</p>
                    <p class="text-sm">Por favor, intenta nuevamente más tarde</p>
                </div>
            `
        }
    }
    const obtenerFavoritos = async () => {
        try {
            const respuesta = await fetch(`/api/favoritos/${idUsuario.textContent}`)
            favoritos = await respuesta.json()
            // Una vez que tenemos los favoritos, actualizamos la vista
            mostrarPropiedades(propiedades)
        } catch(error) {
            console.error('Error al obtener los favoritos:', error)
        }
    }

    const mostrarPropiedades = (propiedades) => {
        // Limpiar el contenedor
        propiedadesContenedor.innerHTML = ''
        
        propiedades.forEach(propiedad => {
            const { id, titulo, imagen, precio, habitaciones, wc, estacionamiento, calle } = propiedad

            const div = document.createElement('div')
            div.innerHTML = `
                <article class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <!-- Imagen -->
                    <div class="relative h-56 overflow-hidden">
                        <img src="/uploads/${propiedad.imagen}" class="w-full h-full object-cover" alt="${propiedad.titulo}">
                        <!-- Overlay gradiente -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <!-- Botón de Favoritos -->
                        <button 
                            class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 agregar-favorito cursor-pointer ${favoritos.some(favorito => favorito.propiedadId === propiedad.id) ? 'text-red-500' : 'text-gray-400'}"
                            data-propiedad-id="${propiedad.id}"
                            data-usuario-id="${idUsuario.textContent}"
                        >
                            <i class="fas fa-heart"></i>
                        </button>

                        <!-- Precio -->
                        <div class="absolute bottom-4 right-4">
                            <p class="bg-white/90 backdrop-blur-sm text-gray-600 px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                                $ ${propiedad.precio.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <!-- Contenido -->
                    <div class="p-5">
                        <!-- Título -->
                        <h3 class="text-lg font-bold text-gray-800 mb-4 line-clamp-1">${propiedad.titulo}</h3>

                        <!-- Características principales -->
                        <div class="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                            <div class="flex flex-col items-center text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                    <i class="fas fa-bed text-gray-600"></i>
                                </div>
                                <span class="text-sm text-gray-600">${propiedad.habitaciones} Hab.</span>
                            </div>
                            <div class="flex flex-col items-center text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                    <i class="fas fa-bath text-gray-600"></i>
                                </div>
                                <span class="text-sm text-gray-600">${propiedad.wc} Baños</span>
                            </div>
                            <div class="flex flex-col items-center text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                    <i class="fas fa-car text-gray-600"></i>
                                </div>
                                <span class="text-sm text-gray-600">${propiedad.estacionamiento} Est.</span>
                            </div>
                        </div>

                        <!-- Ubicación y botón -->
                        <div class="mt-4 flex items-center justify-between">
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                <span class="text-sm truncate">${propiedad.calle}</span>
                            </div>
                            <a href="/propiedades/${propiedad.id}" class="inline-flex items-center text-[#FF6819] hover:text-[#E55A0F] transition-colors duration-200 group-hover:translate-x-1 transition-transform duration-200">
                                <span class="text-sm font-medium mr-2">Ver detalles</span>
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `
            propiedadesContenedor.appendChild(div)
        })
        const botonesFavorito = document.querySelectorAll('.agregar-favorito')
        // Agregar event listeners a los botones de favoritos
        botonesFavorito.forEach(boton => {
            boton.addEventListener('click', async () => {
                const propiedadId = boton.dataset.propiedadId

                const respuesta = await fetch(`/favoritos/${propiedadId}`, {
                    method: 'POST',
                    headers: {
                        'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                })

                const resultado = await respuesta.json()        

                if (resultado.resultado) {
                    if (resultado.accion === 'eliminado') {
                        boton.classList.remove('text-red-500')
                        boton.classList.add('text-gray-400')
                    } else {
                        boton.classList.remove('text-gray-400')
                        boton.classList.add('text-red-500')
                    }
                }
            })
        })
    }
    
    // Primero obtenemos las propiedades
    obtenerPropiedades()
    // Luego obtenemos los favoritos
    obtenerFavoritos()
})()
