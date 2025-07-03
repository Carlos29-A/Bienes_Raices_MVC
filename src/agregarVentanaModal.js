//- Recoger el valor del mensaje
const valorMensaje = document.getElementById('valorMensaje');
if (valorMensaje && valorMensaje.dataset.show === 'true') {
    //- Mostrar el modal
    const modalMensaje = document.getElementById('modalMensaje');
    if (modalMensaje) {
        modalMensaje.classList.remove('hidden');
        const contenedorSpinner = document.querySelector('#contenedorSpinner');
        
        //- Ocultar el mensaje principal inicialmente
        const mensajePrincipal = document.getElementById('mensajePrincipal');
        if (mensajePrincipal) {
            mensajePrincipal.classList.add('hidden');
        }
        
        //- Animacion de entrada
        setTimeout(() => {
            const modalContent = modalMensaje.querySelector('.bg-white');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 500);
        
        mostrarSpinner();

        //- Agregar event listeners después de que el modal existe
        agregarEventListeners();

        function mostrarSpinner() {
            if (!contenedorSpinner) return;
            
            //- Deshabilitar el botón inicialmente
            const btnAceptar = document.getElementById('btnAceptar');
            if (btnAceptar) {
                btnAceptar.disabled = true;
                btnAceptar.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'cursor-pointer');
                btnAceptar.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed', 'opacity-50');
            }
            
            //- Mensajes de carga
            const mensajesCarga = [
                "Procesando...",
                "Guardando información...",
                "Finalizando...",
                "¡Completado!"
            ];
            
            let mensajeIndex = 0;
            const mensajeCarga = document.getElementById('mensajeCarga');
            
            //- Función para cambiar mensajes
            function cambiarMensaje() {
                if (mensajeCarga && mensajeIndex < mensajesCarga.length) {
                    mensajeCarga.textContent = mensajesCarga[mensajeIndex];
                    mensajeIndex++;
                }
            }
            
            //- Cambiar mensaje inicial
            cambiarMensaje();
            
            //Crear un div con la clase sk-chase
            const spinner = document.createElement('DIV');
            spinner.classList.add('sk-chase');
            //- Crear 4 divs con la clase sk-chase-dot
            for (let i = 0; i < 4; i++) {
                const dot = document.createElement('DIV');
                dot.classList.add('sk-chase-dot');
                spinner.appendChild(dot);
            }
            //- Agregar el spinner al contenedor
            contenedorSpinner.appendChild(spinner);
            
            //- Cambiar mensajes cada segundo
            const intervalMensajes = setInterval(() => {
                cambiarMensaje();
            }, 1000);
            
            const contenedorIconoCheck = document.getElementById('contenedorIconoCheck');
            setTimeout(() => {
                //- Detener el intervalo de mensajes
                clearInterval(intervalMensajes);
                
                //- Eliminar el spinner
                if (spinner && spinner.parentNode) {
                    spinner.remove();
                }
                if (contenedorIconoCheck) {
                    contenedorIconoCheck.classList.remove('hidden');
                    contenedorIconoCheck.classList.add('flex');
                }
                
                //- Mostrar el mensaje principal
                if (mensajePrincipal) {
                    mensajePrincipal.classList.remove('hidden');
                }
                
                //- Mostrar mensaje final
                if (mensajeCarga) {
                    mensajeCarga.textContent = "¡Listo! Puedes continuar.";
                    mensajeCarga.classList.remove('text-gray-600');
                    mensajeCarga.classList.add('text-green-600', 'font-medium');
                }
                
                //- Habilitar el botón cuando aparezca el check
                if (btnAceptar) {
                    btnAceptar.disabled = false;
                    btnAceptar.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed', 'opacity-50');
                    btnAceptar.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'cursor-pointer');
                }
            }, 4000);
        }

        function limpiarContenedor() {
            if (contenedorSpinner) {
                while (contenedorSpinner.firstChild) {
                    contenedorSpinner.removeChild(contenedorSpinner.firstChild);
                }
            }
        }

        function agregarEventListeners() {
            //- Cerrar cuando se haga click fuera
            modalMensaje.addEventListener('click', function (e) {
                if (e.target === this) cerrarModalMensaje();
            });

            //- Cerrar con Escape
            const handleEscape = function (e) {
                if (e.key === 'Escape') cerrarModalMensaje();
            };
            document.addEventListener('keydown', handleEscape);

            //- Limpiar event listener cuando se cierre el modal
            window.cerrarModalMensaje = function() {
                document.removeEventListener('keydown', handleEscape);
                cerrarModalMensaje();
            };
        }
    }
}

//- Cerrar el modal cuando se haga click en el boton de aceptar
function cerrarModalMensaje() {
    //- Encontrar el modal
    const modal = document.getElementById('modalMensaje');
    if (!modal) return;

    //- Animacion de salida
    const modalContent = modal.querySelector('.bg-white');
    if (modalContent) {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        //- Limpiar el contenedor del spinner
        const contenedorSpinner = document.getElementById('contenedorSpinner');
        if (contenedorSpinner) {
            while (contenedorSpinner.firstChild) {
                contenedorSpinner.removeChild(contenedorSpinner.firstChild);
            }
        }
        //- Ocultar el icono de check
        const contenedorIconoCheck = document.getElementById('contenedorIconoCheck');
        if (contenedorIconoCheck) {
            contenedorIconoCheck.classList.add('hidden');
            contenedorIconoCheck.classList.remove('flex');
        }
        
        //- Ocultar el mensaje principal
        const mensajePrincipal = document.getElementById('mensajePrincipal');
        if (mensajePrincipal) {
            mensajePrincipal.classList.add('hidden');
        }
        
        //- Resetear el mensaje de carga
        const mensajeCarga = document.getElementById('mensajeCarga');
        if (mensajeCarga) {
            mensajeCarga.textContent = "Procesando...";
            mensajeCarga.classList.remove('text-green-600', 'font-medium');
            mensajeCarga.classList.add('text-gray-600');
        }
        
        //- Resetear el botón a su estado inicial
        const btnAceptar = document.getElementById('btnAceptar');
        if (btnAceptar) {
            btnAceptar.disabled = true;
            btnAceptar.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'cursor-pointer');
            btnAceptar.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed', 'opacity-50');
        }
    }, 300);
}

//- Hacer la función global para que el botón pueda acceder a ella
window.cerrarModalMensajeEditar = cerrarModalMensaje;
