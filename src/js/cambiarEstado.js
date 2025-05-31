(function () {
    const botonesEstado = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    botonesEstado.forEach(boton => {
        boton.addEventListener('click', async () => {
            const propiedadId = boton.dataset.propiedadId

            try {
                const respuesta = await fetch(`/propiedades/estado/${propiedadId}`, {
                    method: 'PUT',
                    headers: {
                        'CSRF-Token': token
                    }
                })

                const resultado = await respuesta.json()

                if (resultado.resultado) {
                    if (boton.classList.contains('bg-green-100')) {
                        boton.classList.remove('bg-green-100', 'text-green-800')
                        boton.classList.add('bg-yellow-100', 'text-red-800')
                        boton.textContent = 'No Publicado'
                    } else {
                        boton.classList.remove('bg-yellow-100', 'text-red-800')
                        boton.classList.add('bg-green-100', 'text-green-800')
                        boton.textContent = 'Publicado'
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
    })
})()