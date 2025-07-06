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

/***/ "./src/js/notificaciones.js":
/*!**********************************!*\
  !*** ./src/js/notificaciones.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const notificacionesContainer = document.querySelector('#notificaciones-container')\r\n    const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n\r\n    // Función para obtener el conteo de mensajes no leídos\r\n    async function actualizarNotificaciones() {\r\n        try {\r\n            const response = await fetch('/mensajes/no-leidos', {\r\n                headers: {\r\n                    'CSRF-Token': token\r\n                }\r\n            })\r\n            const data = await response.json()\r\n\r\n            if (data.cantidadNoLeidos > 0) {\r\n                // Actualizar el contador de notificaciones\r\n                const contadorElement = document.querySelector('#contador-notificaciones')\r\n                if (contadorElement) {\r\n                    contadorElement.textContent = data.cantidadNoLeidos\r\n                    contadorElement.classList.remove('hidden')\r\n                } else {\r\n                    // Si no existe el elemento, crearlo\r\n                    const nuevoContador = document.createElement('span')\r\n                    nuevoContador.id = 'contador-notificaciones'\r\n                    nuevoContador.className = 'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'\r\n                    nuevoContador.textContent = data.cantidadNoLeidos\r\n                    \r\n                    // Agregar al contenedor de notificaciones\r\n                    const iconoMensajes = document.querySelector('#icono-mensajes')\r\n                    if (iconoMensajes) {\r\n                        iconoMensajes.style.position = 'relative'\r\n                        iconoMensajes.appendChild(nuevoContador)\r\n                    }\r\n                }\r\n            } else {\r\n                // Si no hay mensajes no leídos, ocultar el contador\r\n                const contadorElement = document.querySelector('#contador-notificaciones')\r\n                if (contadorElement) {\r\n                    contadorElement.classList.add('hidden')\r\n                }\r\n            }\r\n        } catch (error) {\r\n            console.error('Error al obtener notificaciones:', error)\r\n        }\r\n    }\r\n\r\n    // Actualizar notificaciones cada minuto\r\n    actualizarNotificaciones()\r\n    setInterval(actualizarNotificaciones, 60000)\r\n})(); \n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/notificaciones.js?");

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
/******/ 	__webpack_modules__["./src/js/notificaciones.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;