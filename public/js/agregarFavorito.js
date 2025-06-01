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

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const botonesFavorito = document.querySelectorAll('.agregar-favorito')\r\n\r\n    botonesFavorito.forEach(boton => {\r\n        boton.addEventListener('click', async () => {\r\n            const propiedadId = boton.dataset.propiedadId\r\n\r\n            const respuesta = await fetch(`/favoritos/${propiedadId}`, {\r\n                method: 'POST',\r\n                headers: {\r\n                    'CSRF-Token': document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n                }\r\n            })\r\n\r\n            const resultado = await respuesta.json()\r\n\r\n            if (resultado.resultado) {\r\n                if (resultado.accion === 'eliminado') {\r\n                    boton.classList.remove('text-red-500')\r\n                    boton.classList.add('text-gray-400')\r\n                } else {\r\n                    boton.classList.remove('text-gray-400')\r\n                    boton.classList.add('text-red-500')\r\n                }\r\n            }\r\n        })\r\n    })\r\n})()\r\n\n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/agregarFavorito.js?");

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