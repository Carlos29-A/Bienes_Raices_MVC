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

/***/ "./src/js/accesibilidad.js":
/*!*********************************!*\
  !*** ./src/js/accesibilidad.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Tamaños de letra predefinidos\r\nconst tamanos = {\r\n    0: {\r\n        'body': '16px',\r\n        'h1': '2.25rem',\r\n        'h2': '1.875rem',\r\n        'h3': '1.5rem',\r\n        'p': '1rem',\r\n        'button': '1rem',\r\n        'input': '1rem',\r\n        'textarea': '1rem',\r\n        'a': '1rem',\r\n        'span': '1rem',\r\n        'label': '1rem',\r\n        'select': '1rem',\r\n        'option': '1rem',\r\n        'img': '1rem'\r\n\r\n    },\r\n    1: {\r\n        'body': '18px',\r\n        'h1': '2.5rem',\r\n        'h2': '2.125rem',\r\n        'h3': '1.75rem',\r\n        'p': '1.125rem',\r\n        'button': '1.125rem',\r\n        'input': '1.125rem',\r\n        'textarea': '1.125rem', \r\n        'a': '1.125rem',\r\n        'span': '1.125rem',\r\n        'label': '1.125rem',\r\n        'select': '1.125rem',\r\n        'option': '1.125rem',\r\n    },\r\n    2: {\r\n        'body': '20px',\r\n        'h1': '2.75rem',\r\n        'h2': '2.375rem',\r\n        'h3': '2rem',\r\n        'p': '1.25rem',\r\n        'button': '1.25rem',\r\n        'input': '1.25rem',\r\n        'textarea': '1.25rem',\r\n        'a': '1.25rem',\r\n        'span': '1.25rem',\r\n        'label': '1.25rem',\r\n        'select': '1.25rem',\r\n        'option': '1.25rem',\r\n    },\r\n    3: {\r\n        'body': '22px',\r\n        'h1': '3rem',\r\n        'h2': '2.625rem',\r\n        'h3': '2.25rem',\r\n        'p': '1.375rem',\r\n        'button': '1.375rem',\r\n        'input': '1.375rem',\r\n        'textarea': '1.375rem',\r\n        'a': '1.375rem',\r\n        'span': '1.375rem',\r\n        'label': '1.375rem',\r\n        'select': '1.375rem',\r\n        'option': '1.375rem',\r\n    }\r\n};\r\n\r\n// Función para cambiar el tamaño de letra\r\nfunction cambiarTamanoLetra(index) {\r\n    // Guardar preferencia en localStorage\r\n    localStorage.setItem('tamanoLetra', index);\r\n\r\n    // Aplicar los tamaños\r\n    document.body.style.fontSize = tamanos[index].body;\r\n    \r\n    // Actualizar todos los elementos\r\n    document.querySelectorAll('h1').forEach(el => el.style.fontSize = tamanos[index].h1);\r\n    document.querySelectorAll('h2').forEach(el => el.style.fontSize = tamanos[index].h2);\r\n    document.querySelectorAll('h3').forEach(el => el.style.fontSize = tamanos[index].h3);\r\n    document.querySelectorAll('p').forEach(el => el.style.fontSize = tamanos[index].p);\r\n    document.querySelectorAll('button').forEach(el => el.style.fontSize = tamanos[index].button);\r\n    document.querySelectorAll('input').forEach(el => el.style.fontSize = tamanos[index].input);\r\n    document.querySelectorAll('textarea').forEach(el => el.style.fontSize = tamanos[index].textarea);\r\n    document.querySelectorAll('a').forEach(el => el.style.fontSize = tamanos[index].a);\r\n    document.querySelectorAll('span').forEach(el => el.style.fontSize = tamanos[index].span);\r\n    document.querySelectorAll('label').forEach(el => el.style.fontSize = tamanos[index].label);\r\n    document.querySelectorAll('select').forEach(el => el.style.fontSize = tamanos[index].select);\r\n    document.querySelectorAll('option').forEach(el => el.style.fontSize = tamanos[index].option);\r\n    // Actualizar botones activos\r\n    document.querySelectorAll('#menuAccesibilidad button[data-size]').forEach((btn, i) => {\r\n        const isActive = i.toString() === index.toString();\r\n        btn.classList.toggle('bg-[#FF6819]', isActive);\r\n        btn.classList.toggle('text-white', isActive);\r\n        btn.classList.toggle('bg-gray-100', !isActive);\r\n        btn.classList.toggle('text-gray-700', !isActive);\r\n\r\n        // Efecto de elevación para el botón activo\r\n        btn.classList.toggle('shadow-md', isActive);\r\n        btn.classList.toggle('transform', isActive);\r\n        btn.classList.toggle('scale-110', isActive);\r\n    });\r\n}\r\n\r\n// Función para alternar el menú\r\nfunction toggleMenu() {\r\n    const menu = document.getElementById('menuAccesibilidad');\r\n    const isOpen = menu.classList.contains('scale-100');\r\n    \r\n    menu.classList.toggle('scale-0', isOpen);\r\n    menu.classList.toggle('scale-100', !isOpen);\r\n    menu.classList.toggle('opacity-0', isOpen);\r\n    menu.classList.toggle('opacity-100', !isOpen);\r\n}\r\n\r\n// Función para cerrar el menú si se hace clic fuera\r\nfunction handleClickOutside(event) {\r\n    const menu = document.getElementById('menuAccesibilidad');\r\n    const btn = document.getElementById('btnAccesibilidad');\r\n    \r\n    if (!menu.contains(event.target) && !btn.contains(event.target) && menu.classList.contains('scale-100')) {\r\n        toggleMenu();\r\n    }\r\n}\r\n\r\n// Inicializar cuando el DOM esté listo\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    // Configurar el botón de accesibilidad\r\n    const btnAccesibilidad = document.getElementById('btnAccesibilidad');\r\n    btnAccesibilidad.addEventListener('click', (e) => {\r\n        e.stopPropagation();\r\n        toggleMenu();\r\n    });\r\n\r\n    // Agregar event listeners a los botones de tamaño\r\n    document.querySelectorAll('#menuAccesibilidad button[data-size]').forEach(btn => {\r\n        btn.addEventListener('click', (e) => {\r\n            e.stopPropagation();\r\n            const size = parseInt(btn.dataset.size);\r\n            cambiarTamanoLetra(size);\r\n        });\r\n\r\n        // Agregar efecto hover\r\n        btn.addEventListener('mouseenter', () => {\r\n            btn.classList.add('scale-105');\r\n        });\r\n\r\n        btn.addEventListener('mouseleave', () => {\r\n            if (btn.dataset.size !== localStorage.getItem('tamanoLetra')) {\r\n                btn.classList.remove('scale-105');\r\n            }\r\n        });\r\n    });\r\n\r\n    // Cerrar el menú al hacer clic fuera\r\n    document.addEventListener('click', handleClickOutside);\r\n\r\n    // Aplicar tamaño guardado\r\n    const tamanoGuardado = localStorage.getItem('tamanoLetra');\r\n    if (tamanoGuardado !== null) {\r\n        cambiarTamanoLetra(parseInt(tamanoGuardado));\r\n    }\r\n}); \n\n//# sourceURL=webpack://bienes_raices_mvc/./src/js/accesibilidad.js?");

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
/******/ 	__webpack_modules__["./src/js/accesibilidad.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;