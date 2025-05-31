/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Inicializar el mapa\r\n(function () {\r\n    const lat = document.querySelector('#lat').value || -8.0829866;\r\n    const lng = document.querySelector('#lng').value || -79.0435734;\r\n    const mapa = L.map('mapa').setView([lat, lng], 16);\r\n    let marker;\r\n\r\n    // Utilizar Provider y Geocoder\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    // Agregar el tile layer (el mapa base)\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    // Función para crear el contenido del popup\r\n    const crearContenidoPopup = (resultado) => {\r\n        const { address } = resultado;\r\n        return `\r\n            <div class=\"p-2\">\r\n                <h3 class=\"font-bold text-lg mb-2\">${address.Address || 'Dirección'}</h3>\r\n                <div class=\"space-y-1 text-sm\">\r\n                    <p><span class=\"font-semibold\">Ciudad:</span> ${address.City || 'No especificada'}</p>\r\n                    <p><span class=\"font-semibold\">Región:</span> ${address.Region || 'No especificada'}</p>\r\n                    <p><span class=\"font-semibold\">País:</span> ${address.CountryCode || 'No especificado'}</p>\r\n                    <p><span class=\"font-semibold\">Código Postal:</span> ${address.Postal || 'No especificado'}</p>\r\n                    <div class=\"mt-2 pt-2 border-t\">\r\n                        <p class=\"text-xs text-gray-500\">Coordenadas: ${address.latlng?.lat.toFixed(6)}, ${address.latlng?.lng.toFixed(6)}</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        `;\r\n    };\r\n\r\n    // Agregar el marcador\r\n    marker = new L.marker([lat, lng], {\r\n        draggable: true,\r\n        autoPan: true\r\n    }).addTo(mapa);\r\n\r\n    // Detectar el movimiento del pin\r\n    marker.on('moveend', function (e) {\r\n        marker = e.target;\r\n        const posicion = marker.getLatLng();\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n        // Obtener la información de las calles al soltar el pin\r\n        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {\r\n            if (error) return;\r\n\r\n            // Crear y mostrar el popup con información detallada\r\n            const popupContent = crearContenidoPopup(resultado);\r\n            marker.bindPopup(popupContent, {\r\n                maxWidth: 300,\r\n                className: 'custom-popup'\r\n            }).openPopup();\r\n\r\n            // Actualizar los inputs correctamente\r\n            document.querySelector('#calle').value = resultado?.address?.Address ?? '';\r\n            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';\r\n            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';\r\n        });\r\n    });\r\n\r\n    // Agregar estilos personalizados para el popup\r\n    const style = document.createElement('style');\r\n    style.textContent = `\r\n        .custom-popup .leaflet-popup-content-wrapper {\r\n            background: white;\r\n            border-radius: 8px;\r\n            box-shadow: 0 2px 4px rgba(0,0,0,0.1);\r\n        }\r\n        .custom-popup .leaflet-popup-content {\r\n            margin: 0;\r\n            padding: 0;\r\n        }\r\n        .custom-popup .leaflet-popup-tip {\r\n            background: white;\r\n        }\r\n    `;\r\n    document.head.appendChild(style);\r\n})();\r\n\r\n\n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;