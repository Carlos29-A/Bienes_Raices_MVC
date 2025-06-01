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
                } else {
                    boton.classList.remove('text-gray-400')
                    boton.classList.add('text-red-500')
                }
            }
        })
    })
})()
