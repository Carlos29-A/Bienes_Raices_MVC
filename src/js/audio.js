// Configuración de comandos de voz
const COMANDOS = {
    VENDEDOR: {
        PUBLICAR_PROPIEDAD: {
            ruta: '/propiedades/crearPropiedad',
            variantes: ['publicar propiedad', 'crear propiedad', 'nueva propiedad', 'agregar propiedad', 'subir propiedad']
        },
        VER_PROPIEDADES: {
            ruta: '/propiedades/mis-propiedades',
            variantes: ['ver propiedades', 'mis propiedades', 'mostrar propiedades', 'listar propiedades', 'propiedades publicadas']
        },
        MENSAJES: {
            ruta: '/mensajes/obtener/vendedor',
            variantes: ['mensajes vendedor', 'ver mensajes vendedor', 'bandeja de entrada vendedor', 'mensajes de vendedor']
        },
        PERFIL: {
            ruta: '/auth/editar-perfil',
            variantes: ['perfil vendedor', 'ver perfil vendedor', 'mi perfil vendedor', 'editar perfil vendedor']
        },
        PANEL: {
            ruta: '/auth/vendedor/panel',
            variantes: ['panel de inicio vendedor', 'inicio vendedor', 'dashboard vendedor', 'panel vendedor', 'página principal vendedor']
        }
    },
    COMPRADOR: {
        PANEL: {
            ruta: '/auth/comprador/panel',
            variantes: ['panel comprador', 'inicio comprador', 'dashboard comprador', 'página principal comprador']
        },
        MENSAJES: {
            ruta: '/mensajes/obtener/comprador',
            variantes: ['mensajes comprador', 'ver mensajes comprador', 'bandeja de entrada comprador', 'mensajes de comprador', 'mis mensajes comprador', 'ver mis mensajes']
        },
        PERFIL: {
            ruta: '/auth/editar-perfil',
            variantes: ['perfil comprador', 'ver perfil comprador', 'mi perfil comprador', 'editar perfil comprador']
        },
        FAVORITOS: {
            ruta: '/favoritos/propiedades-favoritas',
            variantes: ['favoritos', 'mis favoritos', 'propiedades favoritas', 'ver favoritos']
        },
        BUSCAR: {
            ruta: '/propiedades/buscar',
            variantes: ['buscar', 'buscar propiedades', 'búsqueda', 'encontrar propiedad', 'búsqueda de propiedades']
        },
        CATEGORIAS: {
            CASAS: {
                ruta: '/propiedades/categorias/1',
                variantes: ['ver casas', 'mostrar casas', 'casas disponibles', 'categoría casas']
            },
            DEPARTAMENTOS: {
                ruta: '/propiedades/categorias/2',
                variantes: ['ver departamentos', 'mostrar departamentos', 'departamentos disponibles', 'categoría departamentos']
            },
            BODEGAS: {
                ruta: '/propiedades/categorias/3',
                variantes: ['ver bodegas', 'mostrar bodegas', 'bodegas disponibles', 'categoría bodegas']
            },
            TERRENOS: {
                ruta: '/propiedades/categorias/4',
                variantes: ['ver terrenos', 'mostrar terrenos', 'terrenos disponibles', 'categoría terrenos']
            },
            CABANAS: {
                ruta: '/propiedades/categorias/5',
                variantes: ['ver cabañas', 'mostrar cabañas', 'cabañas disponibles', 'categoría cabañas']
            }
        }
    },
    PUBLICO: {
        INICIO: {
            ruta: '/',
            variantes: ['inicio', 'página principal', 'home', 'página de inicio', 'volver al inicio']
        },
        NOSOTROS: {
            ruta: '/nosotros',
            variantes: ['nosotros', 'sobre nosotros', 'quiénes somos', 'acerca de', 'información']
        },
        CONTACTO: {
            ruta: '/contacto',
            variantes: ['contacto', 'contactar', 'información de contacto', 'página de contacto']
        },
        LOGIN: {
            ruta: '/auth/login',
            variantes: ['iniciar sesión', 'login', 'entrar', 'acceder', 'ingresar']
        },
        REGISTRO: {
            ruta: '/auth/registro',
            variantes: ['registrarse', 'registro', 'crear cuenta', 'nueva cuenta', 'registrar usuario']
        },
        RECUPERAR: {
            ruta: '/auth/olvide-password',
            variantes: ['olvidé mi contraseña', 'recuperar contraseña', 'restablecer contraseña', 'cambiar contraseña']
        }
    }
};

// Elemento para mostrar feedback visual
const crearFeedbackElement = () => {
    const feedback = document.createElement('div');
    feedback.id = 'voiceFeedback';
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: rgba(255, 104, 25, 0.9);
        color: white;
        border-radius: 8px;
        font-size: 16px;
        z-index: 1000;
        display: none;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(feedback);
    return feedback;
};

// Mostrar feedback
const mostrarFeedback = (mensaje, tipo = 'info') => {
    const feedback = document.getElementById('voiceFeedback') || crearFeedbackElement();
    feedback.textContent = mensaje;
    feedback.style.display = 'block';
    feedback.style.backgroundColor = tipo === 'error' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(255, 104, 25, 0.9)';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
};

// Encontrar comando por texto
const encontrarComando = (texto) => {
    texto = texto.toLowerCase().trim();
    
    // Primero buscar comandos específicos (con más palabras)
    let mejorCoincidencia = {
        ruta: null,
        palabras: 0
    };

    // Recorrer todos los grupos de comandos
    for (const grupo in COMANDOS) {
        for (const comando in COMANDOS[grupo]) {
            if (typeof COMANDOS[grupo][comando] === 'object' && COMANDOS[grupo][comando].variantes) {
                // Verificar comando principal
                COMANDOS[grupo][comando].variantes.forEach(variante => {
                    if (texto.includes(variante.toLowerCase())) {
                        const palabrasEnVariante = variante.split(' ').length;
                        if (palabrasEnVariante > mejorCoincidencia.palabras) {
                            mejorCoincidencia = {
                                ruta: COMANDOS[grupo][comando].ruta,
                                palabras: palabrasEnVariante
                            };
                        }
                    }
                });
            } else if (typeof COMANDOS[grupo][comando] === 'object') {
                // Buscar en subcategorías
                for (const subcomando in COMANDOS[grupo][comando]) {
                    COMANDOS[grupo][comando][subcomando].variantes.forEach(variante => {
                        if (texto.includes(variante.toLowerCase())) {
                            const palabrasEnVariante = variante.split(' ').length;
                            if (palabrasEnVariante > mejorCoincidencia.palabras) {
                                mejorCoincidencia = {
                                    ruta: COMANDOS[grupo][comando][subcomando].ruta,
                                    palabras: palabrasEnVariante
                                };
                            }
                        }
                    });
                }
            }
        }
    }

    return mejorCoincidencia.ruta;
};

// Inicializar reconocimiento de voz
const btnaudio = document.querySelector('#btnAudio');
btnaudio?.addEventListener('click', ejecutarAudio);

function ejecutarAudio() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
        mostrarFeedback('Tu navegador no soporta el reconocimiento de voz', 'error');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = () => {
        mostrarFeedback('Escuchando...');
    };

    recognition.onspeechend = () => {
        mostrarFeedback('Procesando...');
        recognition.stop();
    };

    recognition.onerror = (event) => {
        let mensaje = 'Error en el reconocimiento de voz';
        if (event.error === 'no-speech') {
            mensaje = 'No se detectó ninguna voz';
        } else if (event.error === 'audio-capture') {
            mensaje = 'No se detectó micrófono';
        } else if (event.error === 'not-allowed') {
            mensaje = 'Permiso de micrófono denegado';
        }
        mostrarFeedback(mensaje, 'error');
    };

    recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript;
        console.log('Texto reconocido:', texto);
        
        const ruta = encontrarComando(texto);
        if (ruta) {
            mostrarFeedback('Redirigiendo...');
            window.location.href = ruta;
        } else {
            mostrarFeedback('Comando no reconocido', 'error');
        }
    };
}