// Tamaños de letra predefinidos
const tamanos = {
    0: {
        'body': '16px',
        'h1': '2.25rem',
        'h2': '1.875rem',
        'h3': '1.5rem',
        'p': '1rem',
        'button': '1rem',
        'input': '1rem',
        'textarea': '1rem'
    },
    1: {
        'body': '18px',
        'h1': '2.5rem',
        'h2': '2.125rem',
        'h3': '1.75rem',
        'p': '1.125rem',
        'button': '1.125rem',
        'input': '1.125rem',
        'textarea': '1.125rem'
    },
    2: {
        'body': '20px',
        'h1': '2.75rem',
        'h2': '2.375rem',
        'h3': '2rem',
        'p': '1.25rem',
        'button': '1.25rem',
        'input': '1.25rem',
        'textarea': '1.25rem'
    },
    3: {
        'body': '22px',
        'h1': '3rem',
        'h2': '2.625rem',
        'h3': '2.25rem',
        'p': '1.375rem',
        'button': '1.375rem',
        'input': '1.375rem',
        'textarea': '1.375rem'
    }
};

// Función para cambiar el tamaño de letra
function cambiarTamanoLetra(index) {
    // Guardar preferencia en localStorage
    localStorage.setItem('tamanoLetra', index);

    // Aplicar los tamaños
    document.body.style.fontSize = tamanos[index].body;
    
    // Actualizar todos los elementos
    document.querySelectorAll('h1').forEach(el => el.style.fontSize = tamanos[index].h1);
    document.querySelectorAll('h2').forEach(el => el.style.fontSize = tamanos[index].h2);
    document.querySelectorAll('h3').forEach(el => el.style.fontSize = tamanos[index].h3);
    document.querySelectorAll('p').forEach(el => el.style.fontSize = tamanos[index].p);
    document.querySelectorAll('button').forEach(el => el.style.fontSize = tamanos[index].button);
    document.querySelectorAll('input').forEach(el => el.style.fontSize = tamanos[index].input);
    document.querySelectorAll('textarea').forEach(el => el.style.fontSize = tamanos[index].textarea);

    // Actualizar botones activos
    document.querySelectorAll('#menuAccesibilidad button[data-size]').forEach((btn, i) => {
        const isActive = i.toString() === index.toString();
        btn.classList.toggle('bg-[#FF6819]', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-100', !isActive);
        btn.classList.toggle('text-gray-700', !isActive);

        // Efecto de elevación para el botón activo
        btn.classList.toggle('shadow-md', isActive);
        btn.classList.toggle('transform', isActive);
        btn.classList.toggle('scale-110', isActive);
    });
}

// Función para alternar el menú
function toggleMenu() {
    const menu = document.getElementById('menuAccesibilidad');
    const isOpen = menu.classList.contains('scale-100');
    
    menu.classList.toggle('scale-0', isOpen);
    menu.classList.toggle('scale-100', !isOpen);
    menu.classList.toggle('opacity-0', isOpen);
    menu.classList.toggle('opacity-100', !isOpen);
}

// Función para cerrar el menú si se hace clic fuera
function handleClickOutside(event) {
    const menu = document.getElementById('menuAccesibilidad');
    const btn = document.getElementById('btnAccesibilidad');
    
    if (!menu.contains(event.target) && !btn.contains(event.target) && menu.classList.contains('scale-100')) {
        toggleMenu();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Configurar el botón de accesibilidad
    const btnAccesibilidad = document.getElementById('btnAccesibilidad');
    btnAccesibilidad.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Agregar event listeners a los botones de tamaño
    document.querySelectorAll('#menuAccesibilidad button[data-size]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const size = parseInt(btn.dataset.size);
            cambiarTamanoLetra(size);
        });

        // Agregar efecto hover
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('scale-105');
        });

        btn.addEventListener('mouseleave', () => {
            if (btn.dataset.size !== localStorage.getItem('tamanoLetra')) {
                btn.classList.remove('scale-105');
            }
        });
    });

    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', handleClickOutside);

    // Aplicar tamaño guardado
    const tamanoGuardado = localStorage.getItem('tamanoLetra');
    if (tamanoGuardado !== null) {
        cambiarTamanoLetra(parseInt(tamanoGuardado));
    }
}); 