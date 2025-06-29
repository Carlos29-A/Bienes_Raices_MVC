// Inicializar el mapa
(function () {
    const lat = document.querySelector('#lat').value || -8.0829866;
    const lng = document.querySelector('#lng').value || -79.0435734;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    // Agregar el tile layer (el mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Función para crear el contenido del popup
    const crearContenidoPopup = (resultado) => {
        const { address } = resultado;
        return `
            <div class="p-2">
                <h3 class="font-bold text-lg mb-2">${address.Address || 'Dirección'}</h3>
                <div class="space-y-1 text-sm">
                    <p><span class="font-semibold">Ciudad:</span> ${address.City || 'No especificada'}</p>
                    <p><span class="font-semibold">Región:</span> ${address.Region || 'No especificada'}</p>
                    <p><span class="font-semibold">País:</span> ${address.CountryCode || 'No especificado'}</p>
                    <p><span class="font-semibold">Código Postal:</span> ${address.Postal || 'No especificado'}</p>
                    <p><span class="font-semibold">Calle:</span> ${address.Address || 'No especificado'}</p>
                    <div class="mt-2 pt-2 border-t">
                        <p class="text-xs text-gray-500">Coordenadas: ${address.latlng?.lat.toFixed(6)}, ${address.latlng?.lng.toFixed(6)}</p>
                    </div>
                </div>
            </div>
        `;
    };

    // Agregar el marcador
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detectar el movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // Obtener la información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            if (error) return;

            // Crear y mostrar el popup con información detallada
            const popupContent = crearContenidoPopup(resultado);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            }).openPopup();

            // Actualizar los inputs correctamente
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        });
    });

    // Agregar estilos personalizados para el popup
    const style = document.createElement('style');
    style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-popup .leaflet-popup-content {
            margin: 0;
            padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
            background: white;
        }
    `;
    document.head.appendChild(style);
})();

