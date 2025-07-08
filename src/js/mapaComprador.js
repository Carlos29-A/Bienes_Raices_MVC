(function(){
    const lat = -8.0829866;
    const lng = -79.0435734;
    const mapa = L.map('mapa-comprador').setView([lat, lng], 16);
    
    const categorias = document.querySelector('#categoria')
    const habitaciones = document.querySelector('#habitaciones')
    const baños = document.querySelector('#baños')
    const estacionamiento = document.querySelector('#estacionamiento')
    // Crear grupo de marcadores
    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = []


    // Filtros
    const filtros = {
        categoria : '',
        habitaciones : '',
        baños : '',
        estacionamiento : '',
    }

    


    // Agregar el tile layer (el mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Eventos de cambio de select 

    categorias.addEventListener('change', (e) => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })
    habitaciones.addEventListener('change', (e) => {
        filtros.habitaciones = +e.target.value
        filtrarPropiedades()
    })
    baños.addEventListener('change', (e) => {
        filtros.baños = +e.target.value
        filtrarPropiedades()
    })
    estacionamiento.addEventListener('change', (e) => {
        filtros.estacionamiento = +e.target.value
        filtrarPropiedades()
    })
    
    // Obtener las propiedades
    const obtenerPropiedades = async () =>{
        try {
            const respuesta = await fetch('/api/propiedades')
            propiedades = await respuesta.json()
            mostrarMarcadores(propiedades)
        }catch(error){
            console.log(error)
        }
    }

    // Mostramos las propiedades en el mapa

    const mostrarMarcadores = (propiedades) =>{
        // Limpiar los marcadores
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            const marcador = new L.marker([propiedad.lat, propiedad.lng], {
                autoPan : true
            }).addTo(mapa)
            .bindPopup(
                `
                 <h2 class="text-sm font-bold text-gray-500">${propiedad.categoriaRelacion.nombre}</h2>
                 <h1 class="text-xl font-bold">${propiedad.titulo}</h1>
                 <img src="/uploads/${propiedad.imagen}" alt="Imagen Propiedad" class="w-full h-48 object-cover">
                 <div class="flex justify-between">
                   <p class="text-sm text-gray-500 font-bold block">$ ${propiedad.precio} </p>
                   <p class="text-sm text-gray-500 font-bold block">
                    <i class="fas fa-bed mr-2"></i>
                    ${propiedad.habitaciones} habitaciones
                   </p>
                   <p class="text-sm text-gray-500 font-bold block">
                    <i class="fas fa-bath mr-2"></i>
                    ${propiedad.wc} baños
                   </p>
                 </div>
                 <a href="/propiedades/${propiedad.id}" class="text-white mt-2 block bg-yellow-500 p-2 text-center hover:bg-yellow-600 transition-colors transition-all rounded-md font-bold">Ver Propiedad</a>
                 `
                 
                 
            )
            markers.addLayer(marcador)
        })

    }
    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarHabitaciones).filter(filtrarBaños).filter(filtrarEstacionamiento)
        mostrarMarcadores(resultado)
        console.log(resultado)
    }
    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    }
    const filtrarHabitaciones = (propiedad) => {
        return filtros.habitaciones ? propiedad.habitaciones === filtros.habitaciones : propiedad
    }
    const filtrarBaños = (propiedad) => {
        return filtros.baños ? propiedad.wc === filtros.baños : propiedad
    }
    const filtrarEstacionamiento = (propiedad) => {
        return filtros.estacionamiento ? propiedad.estacionamiento === filtros.estacionamiento : propiedad
    }

    obtenerPropiedades()
})();