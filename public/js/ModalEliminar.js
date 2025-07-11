window.abrirModalEliminarMensaje = function(id, titulo, mensaje, ruta) {
    // Seleccionamos los elementos
    const modalEliminar = document.getElementById('modalEliminar');
    const tituloModalEliminar = document.querySelector('#tituloModalEliminar');
    const mensajeModalEliminar = document.querySelector('#mensajeModalEliminar');

    // Mostramos el modal
    modalEliminar.classList.remove('hidden');
    modalEliminar.classList.add('flex');

    // Actualizamos el titulo y el mensaje
    tituloModalEliminar.textContent = titulo;
    mensajeModalEliminar.textContent = mensaje;

    // Actualizamos la acción del formulario
    const formEliminar = document.getElementById('formEliminar');
    
    if(!formEliminar){
        return;
    }

    formEliminar.action = ruta;

    // Mostramos el modal con animación
    setTimeout(() =>{
        const modalContent = modalEliminar.querySelector('.bg-white');
        if(modalContent){
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}

window.cerrarModalEliminar = function() {
    const modalEliminar = document.getElementById('modalEliminar');
    if(!modalEliminar){
        return;
    }

    const modalContent = modalEliminar.querySelector('.bg-white');
    if(!modalContent){
        return;
    }

    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() =>{
        modalEliminar.classList.add('hidden');
        modalEliminar.classList.remove('flex');
    }, 200);
}

// Función para mostrar modal de carga durante eliminación
window.mostrarModalCargaEliminacion = function() {
    // Cerrar modal de confirmación
    window.cerrarModalEliminar();
    
    // Mostrar modal de carga usando el modalMensaje existente
    const modalMensaje = document.getElementById('modalMensaje');
    const mensajeCarga = document.getElementById('mensajeCarga');
    const mensajePrincipal = document.getElementById('mensajePrincipal');
    
    if(modalMensaje && mensajeCarga) {
        modalMensaje.classList.remove('hidden');
        mensajeCarga.textContent = 'Eliminando comentario...';
        
        if (mensajePrincipal) {
            mensajePrincipal.classList.add('hidden');
        }
        
        // Animación de entrada
        setTimeout(() => {
            const modalContent = modalMensaje.querySelector('.bg-white');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 100);
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('DOMContentLoaded', function(){
    const modalEliminar = document.getElementById('modalEliminar');
    if(modalEliminar){
        modalEliminar.addEventListener('click', function(e){
            if(e.target === modalEliminar){
                window.cerrarModalEliminar();
            }
        });
    }
    
    // Event listener para el formulario de eliminación
    const formEliminar = document.getElementById('formEliminar');
    if(formEliminar) {
        formEliminar.addEventListener('submit', function() {
            // Mostrar modal de carga
            window.mostrarModalCargaEliminacion();
        });
    }
});