import { GoogleGenAI } from "@google/genai";

function initializeChatbot() {
    if (!window.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY no está configurada.');
        return;
    }

    const ai = new GoogleGenAI({
        apiKey: window.GEMINI_API_KEY
    });

    const SYSTEM_CONTEXT = `Soy un asistente virtual especializado en el sistema de Bienes Raíces. Te ayudo a entender cómo funciona cada parte del sistema.

INSTRUCCIONES IMPORTANTES:
- Responde de forma CONCISA y DIRECTA
- NO uses negritas, cursivas, subrayados ni formato markdown
- Solo usa texto plano e iconos emoji
- Responde en máximo 3 a 6  líneas
- Solo menciona funcionalidades que están en este contexto
- NO inventes funcionalidades que no estén listadas aquí

SISTEMA DE BIENES RAÍCES - FUNCIONALIDADES PRINCIPALES:

TIPOS DE USUARIOS:

USUARIO PÚBLICO (Sin registro):
- Ver listado de propiedades disponibles
- Usar filtros de búsqueda (ubicación, habitaciones, baños, estacionamiento, precio)
- Ver detalles completos de propiedades
- Ver perfil de vendedores
- Registrarse como comprador o vendedor
- Contactar vendedores (redirige a login)

COMPRADOR (Tipo 2):
- Acceso: Registro + confirmación email + login
- Funciones principales:
  * Guardar propiedades en favoritos (corazón)
  * Gestionar lista de favoritos con filtros
  * Enviar mensajes a vendedores sobre propiedades
  * Recibir y responder mensajes de vendedores
  * Calificar vendedores (1-5 estrellas + comentarios)
  * Editar y eliminar sus calificaciones
  * Buscar propiedades con filtros avanzados
  * Ver historial de mensajes enviados
  * Ver perfil con estadísticas y calificaciones de los vendedores
  * Acceder a mapa interactivo de propiedades

VENDEDOR (Tipo 1):
- Acceso: Registro + confirmación email + login
- Funciones principales:
  * Publicar propiedades (título, precio, descripción, características)
  * Subir una imagen por propiedad
  * Gestionar publicaciones (activar/desactivar)
  * Editar información de propiedades
  * Eliminar propiedades
  * Recibir mensajes de compradores
  * Responder mensajes
  * Gestionar información personal

ADMINISTRADOR (Tipo 3):
- Acceso: Credenciales especiales
- Funciones principales:
  * Panel de control con estadísticas
  * Gestionar usuarios (crear, editar, eliminar)
  * Gestionar propiedades (crear, editar, eliminar)
  * Gestionar categorías (crear, editar, eliminar)
  * Supervisar mensajes entre usuarios
  * Ver estadísticas del sistema

FUNCIONALIDADES ESPECÍFICAS:

BÚSQUEDA Y FILTROS DE PROPIEDADES:
- Filtros por: ubicación, categoría, habitaciones, baños, estacionamiento, precio
- Búsqueda por texto en título
- Vista de mapa interactivo con propiedades
- Resultados en tiempo real

SISTEMA DE MENSAJES:
- Compradores envían mensajes a vendedores sobre propiedades
- Vendedores pueden responder mensajes
- Historial de conversaciones
- Marcado de mensajes leídos/no leídos
- Edición y eliminación de mensajes propios

SISTEMA DE FAVORITOS:
- Compradores guardan propiedades en favoritos
- Gestión de lista de favoritos
- Filtros en favoritos
- Indicador visual (corazón rojo/gris)

SISTEMA DE CALIFICACIONES:
- Compradores califican vendedores (1-5 estrellas)
- Comentarios asociados a calificaciones
- Edición y eliminación de calificaciones propias
- Promedio de calificaciones en perfil de vendedor

GESTIÓN DE PROPIEDADES:
- Información completa: título, precio, descripción, ubicación, habitaciones, baños, estacionamiento
- Una imagen por propiedad
- Estados: activa/inactiva
- Categorización por tipo de propiedad (casa, departamento, terreno, etc.)

INTERFAZ Y ACCESIBILIDAD:
- Diseño responsive con colores naranja (#FF6819)
- Chatbot integrado para ayuda
- Sistema de audio para comandos de voz
- Iconos de accesibilidad
- Notificaciones flash para acciones

¿En qué puedo ayudarte específicamente? Puedo explicarte procesos, funcionalidades, o guiarte en el uso del sistema.`;

    const toggleChat = document.querySelector('#toggleChat');
    const minimizeChat = document.querySelector('#minimizeChat');
    const chatWindow = document.querySelector('#chatWindow');
    const formulario = document.querySelector('#formulario');
    const mensajeInput = document.querySelector('#mensaje');
    const enviarBtn = document.querySelector('#enviar');
    const respuestaContainer = document.querySelector('#respuesta');

    function adjustTextareaHeight() {
        mensajeInput.style.height = 'auto';
        mensajeInput.style.height = `${mensajeInput.scrollHeight}px`;
    }

    function createMessageElement(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start gap-2 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`;

        const iconContainer = document.createElement('div');
        iconContainer.className = 'bg-white rounded-full p-2 flex items-center justify-center';

        const icon = document.createElement('i');
        icon.className = isUser ? 'fas fa-user text-[#FF6819] text-sm' : 'fas fa-robot text-[#FF6819] text-sm';
        
        const messageContent = document.createElement('div');
        messageContent.className = `rounded-lg p-3 shadow-sm ${isUser ? 'bg-[#FF6819] text-white' : 'bg-white text-gray-800'} ${isUser ? 'ml-auto' : ''} max-w-[80%]`;
        
        const messageText = document.createElement('p');
        messageText.className = 'whitespace-pre-wrap';
        messageText.innerHTML = isUser ? text : formatMessage(text);

        iconContainer.appendChild(icon);
        messageContent.appendChild(messageText);
        messageDiv.appendChild(iconContainer);
        messageDiv.appendChild(messageContent);

        return messageDiv;
    }

    function formatMessage(text) {
        return text
            .replace(/VISITANTE/g, '👤 VISITANTE')
            .replace(/COMPRADOR/g, '🏠 COMPRADOR')
            .replace(/VENDEDOR/g, '💼 VENDEDOR')
            .replace(/ADMINISTRADOR/g, '👨‍💼 ADMINISTRADOR')
            .replace(/REGISTRO:/g, '📝 REGISTRO:')
            .replace(/FUNCIONES:/g, '🔑 FUNCIONES:')
            .replace(/PASOS:/g, '📋 PASOS:')
            .replace(/\n-/g, '\n• ')
            .replace(/\n\d\./g, match => `\n${match.replace('.', ')')}`)
            .trim();
    }

    function scrollToBottom() {
        respuestaContainer.scrollTop = respuestaContainer.scrollHeight;
    }

    if (toggleChat) {
        toggleChat.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatWindow.style.right = '5rem';
                mensajeInput.focus();
            } else {
                chatWindow.style.right = '-24rem';
            }
        });
    }

    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            chatWindow.style.right = '-24rem';
        });
    }

    if (mensajeInput) {
        mensajeInput.addEventListener('input', adjustTextareaHeight);
        mensajeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formulario.dispatchEvent(new Event('submit'));
            }
        });
    }

    let ultimaPeticion = 0;

    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!window.GEMINI_API_KEY) {
                alert('Error: Clave de API no disponible.');
                return;
            }

            const ahora = Date.now();
            if (ahora - ultimaPeticion < 2000) return; // 2 segundos entre envíos
            ultimaPeticion = ahora;

            const mensaje = mensajeInput.value.trim();
            if (mensaje === '') return;

            respuestaContainer.appendChild(createMessageElement(mensaje, true));
            scrollToBottom();

            mensajeInput.value = '';
            adjustTextareaHeight();
            enviarBtn.disabled = true;

            const typingIndicator = createMessageElement('...', false);
            respuestaContainer.appendChild(typingIndicator);
            scrollToBottom();

            const promptCompleto = `${SYSTEM_CONTEXT}\n\nPregunta del usuario: ${mensaje}\n\nPor favor, proporciona una respuesta detallada y específica basada en el sistema de Bienes Raíces:`;

            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: promptCompleto,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                });

                const respuestaCompleta = response.text;
                typingIndicator.replaceWith(createMessageElement(respuestaCompleta, false));
                scrollToBottom();
            } catch (error) {
                console.error('Error al procesar el mensaje:', error);

                if (error.response?.status === 429) {
                    alert('⚠️ Límite de uso alcanzado. Intenta de nuevo más tarde.');
                } else {
                    alert('❌ Ocurrió un error. Intenta de nuevo.');
                }

                typingIndicator.remove();
            } finally {
                enviarBtn.disabled = false;
                mensajeInput.focus();
            }
        });
    }
}

// Esperar a que el DOM esté cargado y la API key esté lista
document.addEventListener('DOMContentLoaded', () => {
    const initInterval = setInterval(() => {
        if (window.GEMINI_API_KEY) {
            clearInterval(initInterval);
            initializeChatbot();
        }
    }, 500); // Menos agresivo

    setTimeout(() => {
        clearInterval(initInterval);
        if (!window.GEMINI_API_KEY) {
            console.error('Error: No se pudo inicializar el chatbot después de 5 segundos.');
        }
    }, 5000);
});
