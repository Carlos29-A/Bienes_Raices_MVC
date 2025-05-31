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

/***/ "./src/js/filtrarPropiedades.js":
/*!**************************************!*\
  !*** ./src/js/filtrarPropiedades.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Esperar a que la página cargue\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    // Obtener los elementos del HTML que necesitamos\r\n    const selectEstado = document.getElementById('estado_select')\r\n    const selectCategoria = document.getElementById('categoria_select')\r\n    const contenedor = document.querySelector('.divide-y.divide-gray-200')\r\n\r\n    // Función para crear el HTML de una propiedad\r\n    function crearHTMLPropiedad(propiedad) {\r\n        const estado = propiedad.publicado ? 'Publicado' : 'No Publicado'\r\n        const colorEstado = propiedad.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-red-800'\r\n\r\n        return `\r\n            <li class=\"border-b border-gray-200\">\r\n                <div class=\"p-4 flex justify-between items-center\">\r\n                    <!-- Imagen y detalles -->\r\n                    <div class=\"flex\">\r\n                        <img src=\"/uploads/${propiedad.imagen}\" alt=\"Casa\" class=\"w-50 h-30 rounded-lg object-cover\">\r\n                        <div class=\"ml-4\">\r\n                            <h3 class=\"text-lg font-bold\">${propiedad.titulo}</h3>\r\n                            <p class=\"text-gray-600 font-bold\">$ ${propiedad.precio}</p>\r\n                            <div class=\"flex items-center space-x-2\">\r\n                                <p class=\"text-gray-600\"><i class=\"fas fa-map-marker-alt\"></i> ${propiedad.categoriaRelacion.nombre}</p>\r\n                                <p class=\"text-gray-600\"><i class=\"fas fa-location-arrow\"></i> ${propiedad.calle}</p>\r\n                            </div>\r\n                            <div class=\"flex items-center space-x-2\">\r\n                                <p class=\"text-gray-600\"><i class=\"fas fa-bed\"></i> ${propiedad.habitaciones} habitaciones</p>\r\n                                <p class=\"text-gray-600\"><i class=\"fas fa-bath\"></i> ${propiedad.wc} baños</p>\r\n                                <p class=\"text-gray-600\"><i class=\"fas fa-car\"></i> ${propiedad.estacionamiento} estacionamientos</p>\r\n            \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Botones de acción -->\r\n                    <div class=\"mt-4 flex gap-2\">\r\n                        <button \r\n                            class=\"cambiar-estado px-3 py-1 rounded-full ${colorEstado}\"\r\n                            data-propiedad-id=\"${propiedad.id}\"\r\n                        >\r\n                            ${estado}\r\n                        </button>\r\n                        <a href=\"/propiedades/editar/${propiedad.id}\" class=\"text-blue-600\">\r\n                            <i class=\"fas fa-edit\"></i> Editar\r\n                        </a>\r\n                        <form action=\"/propiedades/eliminar/${propiedad.id}\" method=\"POST\" class=\"inline\">\r\n                            <input type=\"hidden\" name=\"_csrf\" value=\"${document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')}\">\r\n                            <button type=\"submit\" class=\"text-red-600\" onclick=\"return confirm('¿Eliminar esta propiedad?')\">\r\n                                <i class=\"fas fa-trash\"></i> Eliminar\r\n                            </button>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n        `\r\n    }\r\n\r\n    // Función para mostrar las propiedades en la página\r\n    function mostrarPropiedades(propiedades) {\r\n        if (propiedades.length === 0) {\r\n            contenedor.innerHTML = '<li class=\"p-4 text-center text-gray-500\">No hay propiedades que coincidan con los filtros</li>'\r\n            return\r\n        }\r\n\r\n        // Crear el HTML de todas las propiedades\r\n        const html = propiedades.map(propiedad => crearHTMLPropiedad(propiedad)).join('')\r\n        contenedor.innerHTML = html\r\n\r\n        // Agregar eventos a los botones de estado\r\n        document.querySelectorAll('.cambiar-estado').forEach(boton => {\r\n            boton.addEventListener('click', async () => {\r\n                const id = boton.dataset.propiedadId\r\n                const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n\r\n                try {\r\n                    // Enviar petición para cambiar el estado\r\n                    const respuesta = await fetch(`/propiedades/estado/${id}`, {\r\n                        method: 'PUT',\r\n                        headers: { 'CSRF-Token': token }\r\n                    })\r\n                    const resultado = await respuesta.json()\r\n\r\n                    // Actualizar el botón si la petición fue exitosa\r\n                    if (resultado.resultado) {\r\n                        if (boton.classList.contains('bg-green-100')) {\r\n                            boton.classList.remove('bg-green-100', 'text-green-800')\r\n                            boton.classList.add('bg-yellow-100', 'text-red-800')\r\n                            boton.textContent = 'No Publicado'\r\n                        } else {\r\n                            boton.classList.remove('bg-yellow-100', 'text-red-800')\r\n                            boton.classList.add('bg-green-100', 'text-green-800')\r\n                            boton.textContent = 'Publicado'\r\n                        }\r\n                    }\r\n                } catch (error) {\r\n                    console.log('Error al cambiar estado:', error)\r\n                }\r\n            })\r\n        })\r\n    }\r\n\r\n    // Función para obtener las propiedades filtradas\r\n    async function obtenerPropiedadesFiltradas() {\r\n        try {\r\n            // Construir la URL con los filtros\r\n            const url = new URL('/propiedades/api/propiedades', window.location.origin)\r\n\r\n            // Siempre enviar el estado, incluso si es 0\r\n            url.searchParams.append('estado', selectEstado.value)\r\n\r\n            // Siempre enviar la categoría, incluso si es 0\r\n            url.searchParams.append('categoria', selectCategoria.value)\r\n\r\n            console.log('URL de búsqueda:', url.toString())\r\n\r\n            // Obtener las propiedades\r\n            const respuesta = await fetch(url)\r\n            const propiedades = await respuesta.json()\r\n            console.log('Propiedades recibidas:', propiedades)\r\n            mostrarPropiedades(propiedades)\r\n        } catch (error) {\r\n            console.log('Error al obtener propiedades:', error)\r\n        }\r\n    }\r\n\r\n    // Agregar eventos a los selectores\r\n    selectEstado.addEventListener('change', obtenerPropiedadesFiltradas)\r\n    selectCategoria.addEventListener('change', obtenerPropiedadesFiltradas)\r\n\r\n    // Cargar propiedades al inicio\r\n    obtenerPropiedadesFiltradas()\r\n})\r\n\n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/filtrarPropiedades.js?");

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
/******/ 	__webpack_modules__["./src/js/filtrarPropiedades.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;