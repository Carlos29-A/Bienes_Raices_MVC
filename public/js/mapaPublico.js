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

/***/ "./src/js/mapaPublico.js":
/*!*******************************!*\
  !*** ./src/js/mapaPublico.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n    const lat = -8.0829866;\r\n    const lng = -79.0435734;\r\n    const mapa = L.map('mapa-comprador').setView([lat, lng], 16);\r\n    \r\n    const categorias = document.querySelector('#categoria')\r\n    const habitaciones = document.querySelector('#habitaciones')\r\n    const baños = document.querySelector('#baños')\r\n    const estacionamiento = document.querySelector('#estacionamiento')\r\n\r\n    // Crear grupo de marcadores\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n    let propiedades = []\r\n\r\n    // Filtros\r\n    const filtros = {\r\n        categoria : '',\r\n        habitaciones : '',\r\n        baños : '',\r\n        estacionamiento : '',\r\n    }\r\n\r\n    // Agregar el tile layer (el mapa base)\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    // Eventos de cambio de select \r\n    if(categorias) {\r\n        categorias.addEventListener('change', (e) => {\r\n            filtros.categoria = +e.target.value\r\n            filtrarPropiedades()\r\n        })\r\n    }\r\n    if(habitaciones) {\r\n        habitaciones.addEventListener('change', (e) => {\r\n            filtros.habitaciones = +e.target.value\r\n            filtrarPropiedades()\r\n        })\r\n    }\r\n    if(baños) {\r\n        baños.addEventListener('change', (e) => {\r\n            filtros.baños = +e.target.value\r\n            filtrarPropiedades()\r\n        })\r\n    }\r\n    if(estacionamiento) {\r\n        estacionamiento.addEventListener('change', (e) => {\r\n            filtros.estacionamiento = +e.target.value\r\n            filtrarPropiedades()\r\n        })\r\n    }\r\n    \r\n    // Obtener las propiedades\r\n    const obtenerPropiedades = async () =>{\r\n        try {\r\n            const respuesta = await fetch('/api/propiedades/publicas')\r\n            propiedades = await respuesta.json()\r\n            mostrarMarcadores(propiedades)\r\n        }catch(error){\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    // Mostramos las propiedades en el mapa\r\n    const mostrarMarcadores = (propiedades) =>{\r\n        // Limpiar los marcadores\r\n        markers.clearLayers()\r\n\r\n        propiedades.forEach(propiedad => {\r\n            const marcador = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan : true\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n                <h2 class=\"text-sm font-bold text-gray-500\">${propiedad.categoriaRelacion.nombre}</h2>\r\n                <h1 class=\"text-xl font-bold\">${propiedad.titulo}</h1>\r\n                <img src=\"/uploads/${propiedad.imagen}\" alt=\"Imagen Propiedad\" class=\"w-full h-48 object-cover\">\r\n                <div class=\"flex justify-between\">\r\n                    <p class=\"text-sm text-gray-500 font-bold block\">$ ${propiedad.precio} </p>\r\n                    <p class=\"text-sm text-gray-500 font-bold block\">\r\n                        <i class=\"fas fa-bed mr-2\"></i>\r\n                        ${propiedad.habitaciones} habitaciones\r\n                    </p>\r\n                    <p class=\"text-sm text-gray-500 font-bold block\">\r\n                        <i class=\"fas fa-bath mr-2\"></i>\r\n                        ${propiedad.wc} baños\r\n                    </p>\r\n                </div>\r\n                <a href=\"/propiedad/${propiedad.id}\" class=\"text-white mt-2 block bg-yellow-500 p-2 text-center hover:bg-yellow-600 transition-colors transition-all rounded-md\">Ver Propiedad</a>\r\n            `)\r\n            markers.addLayer(marcador)\r\n        })\r\n    }\r\n\r\n    const filtrarPropiedades = () => {\r\n        const resultado = propiedades\r\n            .filter(filtrarCategoria)\r\n            .filter(filtrarHabitaciones)\r\n            .filter(filtrarBaños)\r\n            .filter(filtrarEstacionamiento)\r\n        \r\n        mostrarMarcadores(resultado)\r\n    }\r\n\r\n    const filtrarCategoria = (propiedad) => {\r\n        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\r\n    }\r\n    const filtrarHabitaciones = (propiedad) => {\r\n        return filtros.habitaciones ? propiedad.habitaciones === filtros.habitaciones : propiedad\r\n    }\r\n    const filtrarBaños = (propiedad) => {\r\n        return filtros.baños ? propiedad.wc === filtros.baños : propiedad\r\n    }\r\n    const filtrarEstacionamiento = (propiedad) => {\r\n        return filtros.estacionamiento ? propiedad.estacionamiento === filtros.estacionamiento : propiedad\r\n    }\r\n\r\n    obtenerPropiedades()\r\n})(); \n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/mapaPublico.js?");

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
/******/ 	__webpack_modules__["./src/js/mapaPublico.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;