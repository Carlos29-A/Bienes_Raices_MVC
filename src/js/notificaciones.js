(function() {
    const notificacionesContainer = document.querySelector('#notificaciones-container')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    // Función para obtener el conteo de mensajes no leídos
    async function actualizarNotificaciones() {
        try {
            const response = await fetch('/mensajes/no-leidos', {
                headers: {
                    'CSRF-Token': token
                }
            })
            const data = await response.json()

            if (data.cantidadNoLeidos > 0) {
                // Actualizar el contador de notificaciones
                const contadorElement = document.querySelector('#contador-notificaciones')
                if (contadorElement) {
                    contadorElement.textContent = data.cantidadNoLeidos
                    contadorElement.classList.remove('hidden')
                } else {
                    // Si no existe el elemento, crearlo
                    const nuevoContador = document.createElement('span')
                    nuevoContador.id = 'contador-notificaciones'
                    nuevoContador.className = 'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'
                    nuevoContador.textContent = data.cantidadNoLeidos
                    
                    // Agregar al contenedor de notificaciones
                    const iconoMensajes = document.querySelector('#icono-mensajes')
                    if (iconoMensajes) {
                        iconoMensajes.style.position = 'relative'
                        iconoMensajes.appendChild(nuevoContador)
                    }
                }
            } else {
                // Si no hay mensajes no leídos, ocultar el contador
                const contadorElement = document.querySelector('#contador-notificaciones')
                if (contadorElement) {
                    contadorElement.classList.add('hidden')
                }
            }
        } catch (error) {
            console.error('Error al obtener notificaciones:', error)
        }
    }

    // Actualizar notificaciones cada minuto
    actualizarNotificaciones()
    setInterval(actualizarNotificaciones, 60000)
})(); 