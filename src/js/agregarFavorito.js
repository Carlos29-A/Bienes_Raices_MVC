(function () {
    const botonesFavorito = document.querySelectorAll('.agregar-favorito')

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
                    
                    // Si estamos en la página de favoritos, eliminar la tarjeta completa
                    const tarjeta = boton.closest('article')
                    if (tarjeta && window.location.pathname.includes('/favoritos')) {
                        tarjeta.style.transition = 'all 0.3s ease'
                        tarjeta.style.transform = 'scale(0.8)'
                        tarjeta.style.opacity = '0'
                        
                        setTimeout(() => {
                            tarjeta.remove()
                            
                            // Actualizar el contador de favoritos
                            const contador = document.querySelector('.text-lg.font-semibold.text-gray-700')
                            if (contador) {
                                const favoritosRestantes = document.querySelectorAll('.agregar-favorito.text-red-500').length
                                contador.textContent = favoritosRestantes
                            }
                            
                            // Si no quedan favoritos, mostrar mensaje
                            const favoritosRestantes = document.querySelectorAll('.agregar-favorito.text-red-500').length
                            if (favoritosRestantes === 0) {
                                const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
                                if (grid) {
                                    grid.innerHTML = `
                                        <div class="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                                            <div class="mb-6">
                                                <i class="fas fa-heart text-gray-300 text-6xl"></i>
                                            </div>
                                            <h3 class="text-2xl font-bold text-gray-900 mb-4">No tienes propiedades favoritas aún</h3>
                                            <p class="text-gray-600 mb-8 max-w-md mx-auto">Cuando encuentres una propiedad que te guste, haz clic en el corazón para guardarla aquí y acceder fácilmente a ella</p>
                                            <a href="/propiedades/buscar" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6819] to-[#FF8F17] text-white font-medium rounded-lg hover:from-[#E55A0F] hover:to-[#FF6819] transition-all duration-200 transform hover:scale-105 shadow-lg">
                                                <i class="fas fa-search mr-3"></i>
                                                Explorar Propiedades
                                            </a>
                                        </div>
                                    `
                                }
                            }
                        }, 300)
                    }
                } else {
                    boton.classList.remove('text-gray-400')
                    boton.classList.add('text-red-500')
                }
            }
        })
    })
})()
