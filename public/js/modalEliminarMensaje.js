function abrirModalEliminarMensaje(id) {    
    // Mostrar el modal
    const modalEliminar = document.getElementById('modalEliminar');
    if (!modalEliminar) {
        return;
    }
    
    // Actualizar la acción del formulario
    const formEliminar = document.getElementById('formEliminar');
    if (formEliminar) {
        formEliminar.action = `/mensajes/eliminar/${id}`;
    } else {
        console.error('Formulario no encontrado');
    }
    
    // Mostrar el modal con animación
    modalEliminar.classList.remove('hidden');
    modalEliminar.classList.add('flex');
    console.log('Modal mostrado');
    
    // Animar la aparición del modal
    setTimeout(() => {
        const modalContent = modalEliminar.querySelector('.bg-white');
        if (modalContent) {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}

function cerrarModalEliminarMensaje() {
    const modalEliminar = document.getElementById('modalEliminar');
    if (!modalEliminar) return;
    
    // Animar la desaparición del modal
    const modalContent = modalEliminar.querySelector('.bg-white');
    if (modalContent) {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
    }
    
    // Ocultar el modal después de la animación
    setTimeout(() => {
        modalEliminar.classList.add('hidden');
        modalEliminar.classList.remove('flex');
    }, 200);
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('DOMContentLoaded', function() {
    const modalEliminar = document.getElementById('modalEliminar');
    if (modalEliminar) {
        modalEliminar.addEventListener('click', function(e) {
            if (e.target === modalEliminar) {
                cerrarModalEliminarMensaje();
            }
        });
    }
}); 