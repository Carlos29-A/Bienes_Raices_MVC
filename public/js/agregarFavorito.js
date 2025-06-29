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

/***/ "./src/js/agregarFavorito.js":
/*!***********************************!*\
  !*** ./src/js/agregarFavorito.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const botonesFavorito = document.querySelectorAll('.agregar-favorito')\r\n\r\n    botonesFavorito.forEach(boton => {\r\n        boton.addEventListener('click', async () => {\r\n            const propiedadId = boton.dataset.propiedadId\r\n\r\n            const respuesta = await fetch(`/favoritos/${propiedadId}`, {\r\n                method: 'POST',\r\n                headers: {\r\n                    'CSRF-Token': document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n                }\r\n            })\r\n\r\n            const resultado = await respuesta.json()\r\n\r\n            if (resultado.resultado) {\r\n                if (resultado.accion === 'eliminado') {\r\n                    boton.classList.remove('text-red-500')\r\n                    boton.classList.add('text-gray-400')\r\n                    \r\n                    // Si estamos en la página de favoritos, eliminar la tarjeta completa\r\n                    const tarjeta = boton.closest('article')\r\n                    if (tarjeta && window.location.pathname.includes('/favoritos')) {\r\n                        tarjeta.style.transition = 'all 0.3s ease'\r\n                        tarjeta.style.transform = 'scale(0.8)'\r\n                        tarjeta.style.opacity = '0'\r\n                        \r\n                        setTimeout(() => {\r\n                            tarjeta.remove()\r\n                            \r\n                            // Actualizar el contador de favoritos\r\n                            const contador = document.querySelector('.text-lg.font-semibold.text-gray-700')\r\n                            if (contador) {\r\n                                const favoritosRestantes = document.querySelectorAll('.agregar-favorito.text-red-500').length\r\n                                contador.textContent = favoritosRestantes\r\n                            }\r\n                            \r\n                            // Si no quedan favoritos, mostrar mensaje\r\n                            const favoritosRestantes = document.querySelectorAll('.agregar-favorito.text-red-500').length\r\n                            if (favoritosRestantes === 0) {\r\n                                const grid = document.querySelector('.grid.grid-cols-1.md\\\\:grid-cols-2.lg\\\\:grid-cols-3')\r\n                                if (grid) {\r\n                                    grid.innerHTML = `\r\n                                        <div class=\"col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100\">\r\n                                            <div class=\"mb-6\">\r\n                                                <i class=\"fas fa-heart text-gray-300 text-6xl\"></i>\r\n                                            </div>\r\n                                            <h3 class=\"text-2xl font-bold text-gray-900 mb-4\">No tienes propiedades favoritas aún</h3>\r\n                                            <p class=\"text-gray-600 mb-8 max-w-md mx-auto\">Cuando encuentres una propiedad que te guste, haz clic en el corazón para guardarla aquí y acceder fácilmente a ella</p>\r\n                                            <a href=\"/propiedades/buscar\" class=\"inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6819] to-[#FF8F17] text-white font-medium rounded-lg hover:from-[#E55A0F] hover:to-[#FF6819] transition-all duration-200 transform hover:scale-105 shadow-lg\">\r\n                                                <i class=\"fas fa-search mr-3\"></i>\r\n                                                Explorar Propiedades\r\n                                            </a>\r\n                                        </div>\r\n                                    `\r\n                                }\r\n                            }\r\n                        }, 300)\r\n                    }\r\n                } else {\r\n                    boton.classList.remove('text-gray-400')\r\n                    boton.classList.add('text-red-500')\r\n                }\r\n            }\r\n        })\r\n    })\r\n})()\r\n\n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/agregarFavorito.js?");

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
/******/ 	__webpack_modules__["./src/js/agregarFavorito.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;