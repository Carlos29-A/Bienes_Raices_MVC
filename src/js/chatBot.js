// Importamos las librerias
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, generateObject, streamText } from "ai";

// Función para inicializar el chatbot
function initializeChatbot() {
    // Verificar si tenemos la clave API
    if (!window.OPENROUTER_API_KEY) {
        console.error('Error: OPENROUTER_API_KEY no está configurada.');
        return;
    }

    const openRouter = createOpenRouter({
        apiKey: window.OPENROUTER_API_KEY
    });

    // Contexto base del sistema
    const SYSTEM_CONTEXT = `
    Soy un asistente virtual especializado en el sistema de Bienes Raíces. Te ayudaré a entender cómo funciona cada parte del sistema:

    📌 TIPOS DE USUARIOS Y FUNCIONES:

    👤 USUARIO PÚBLICO
    - Ver listado de propiedades
    - Usar filtros de búsqueda
    - Ver detalles de propiedades
    - Registrarse como comprador o vendedor

    Proceso de Registro:
    1. Clic en "Crear Cuenta"
    2. Elegir tipo: Comprador o Vendedor
    3. Completar datos personales
    4. Verificar email
    5. [Vendedor] Esperar aprobación

    🏠 COMPRADOR
    Acceso:
    1. Registrarse como comprador
    2. Confirmar email
    3. Iniciar sesión

    Funciones:
    - Guardar y gestionar favoritos
    - Enviar mensajes a vendedores
    - Calificar propiedades visitadas
    - Usar búsqueda avanzada
    - Ver historial de mensajes
    - Recibir notificaciones

    💼 VENDEDOR
    Acceso:
    1. Registrarse como vendedor
    2. Confirmar email
    3. Esperar aprobación admin
    4. Iniciar sesión

    Funciones:
    - Publicar propiedades
    - Gestionar publicaciones
    - Subir y organizar imágenes
    - Responder mensajes
    - Ver estadísticas
    - Gestionar perfil

    👨‍💼 ADMINISTRADOR
    Acceso:
    - Credenciales especiales de administrador

    Funciones:
    - Aprobar vendedores
    - Moderar propiedades
    - Gestionar categorías
    - Supervisar mensajes
    - Ver estadísticas
    - Gestionar usuarios

    🔄 PROCESOS PRINCIPALES:

    📝 PUBLICAR PROPIEDAD:
    1. Iniciar sesión como vendedor
    2. Ir a "Publicar Propiedad"
    3. Completar información
    4. Subir imágenes
    5. Esperar aprobación

    💬 CONTACTAR VENDEDOR:
    1. Ver detalle de propiedad
    2. Clic en "Contactar"
    3. Escribir mensaje
    4. Esperar respuesta
    5. Chat activo

    ⭐ CALIFICAR PROPIEDAD:
    1. Visitar propiedad
    2. Ir a "Calificar"
    3. Asignar puntuación
    4. Dejar comentario
    5. Enviar calificación

    ❓ ¿En qué puedo ayudarte? Puedes preguntarme sobre:
    - Cómo realizar acciones específicas
    - Detalles de cada tipo de usuario
    - Procesos del sistema
    - Funcionalidades disponibles
    `;

    // Elementos del DOM
    const toggleChat = document.querySelector('#toggleChat');
    const minimizeChat = document.querySelector('#minimizeChat');
    const chatWindow = document.querySelector('#chatWindow');
    const formulario = document.querySelector('#formulario');
    const mensajeInput = document.querySelector('#mensaje');
    const enviarBtn = document.querySelector('#enviar');
    const respuestaContainer = document.querySelector('#respuesta');

    // Función para ajustar la altura del textarea
    function adjustTextareaHeight() {
        mensajeInput.style.height = 'auto';
        mensajeInput.style.height = (mensajeInput.scrollHeight) + 'px';
    }

    // Función para crear un elemento de mensaje
    function createMessageElement(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start gap-2 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`;
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'bg-white rounded-full p-2 flex items-center justify-center';
        
        const icon = document.createElement('i');
        icon.className = isUser ? 'fas fa-user text-indigo-600 text-sm' : 'fas fa-robot text-indigo-600 text-sm';
        
        const messageContent = document.createElement('div');
        messageContent.className = `rounded-lg p-3 shadow-sm ${isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} ${isUser ? 'ml-auto' : ''} max-w-[80%]`;
        
        const messageText = document.createElement('p');
        messageText.className = 'whitespace-pre-wrap'; // Preservar saltos de línea
        messageText.innerHTML = isUser ? text : formatMessage(text);
        
        iconContainer.appendChild(icon);
        messageContent.appendChild(messageText);
        messageDiv.appendChild(iconContainer);
        messageDiv.appendChild(messageContent);
        
        return messageDiv;
    }

    // Función para formatear el texto con emojis y estilos
    function formatMessage(text) {
        return text
            .replace(/VISITANTE/g, '👤 VISITANTE')
            .replace(/COMPRADOR/g, '🏠 COMPRADOR')
            .replace(/VENDEDOR/g, '💼 VENDEDOR')
            .replace(/ADMINISTRADOR/g, '👨‍💼 ADMINISTRADOR')
            .replace(/REGISTRO:/g, '📝 REGISTRO:')
            .replace(/FUNCIONES:/g, '🔑 FUNCIONES:')
            .replace(/PASOS:/g, '📋 PASOS:')
            .replace(/\n-/g, '\n• ') // Convertir guiones en bullets
            .replace(/\n\d\./g, match => `\n${match.replace('.', ')')}`) // Convertir números en formato de lista
            .trim();
    }

    // Función para hacer scroll al último mensaje
    function scrollToBottom() {
        respuestaContainer.scrollTop = respuestaContainer.scrollHeight;
    }

    // Event Listeners
    if (toggleChat) {
        toggleChat.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                mensajeInput.focus();
            }
        });
    }

    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
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

    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                if (!window.OPENROUTER_API_KEY) {
                    throw new Error('OPENROUTER_API_KEY no está configurada.');
                }

                const mensaje = mensajeInput.value.trim();

                if (mensaje === '') {
                    return;
                }

                // Agregar mensaje del usuario
                respuestaContainer.appendChild(createMessageElement(mensaje, true));
                scrollToBottom();

                // Limpiar input y ajustar altura
                mensajeInput.value = '';
                adjustTextareaHeight();
                enviarBtn.disabled = true;

                // Indicador de escritura
                const typingIndicator = createMessageElement('...', false);
                respuestaContainer.appendChild(typingIndicator);
                scrollToBottom();

                // Construir el prompt
                const promptCompleto = `${SYSTEM_CONTEXT}\n\nPregunta del usuario: ${mensaje}\n\nPor favor, proporciona una respuesta detallada y específica basada en el sistema de Bienes Raíces:`;

                const resultado = streamText({
                    model: openRouter('google/gemini-2.0-flash-exp:free'),
                    prompt: promptCompleto,
                    temperature: 0.7,
                    max_tokens: 1000,
                });

                // Preparar para la nueva respuesta
                let respuestaCompleta = '';

                // Procesar la respuesta
                for await (const text of resultado.textStream) {
                    respuestaCompleta += text;
                    typingIndicator.querySelector('p').textContent = respuestaCompleta;
                    scrollToBottom();
                }

                // Reemplazar el indicador de escritura con la respuesta final
                typingIndicator.replaceWith(createMessageElement(respuestaCompleta, false));
                scrollToBottom();

                enviarBtn.disabled = false;
                mensajeInput.focus();

            } catch (error) {
                console.error('Error al procesar el mensaje:', error);
                alert('Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.');
                enviarBtn.disabled = false;
            }
        });
    }
}

// Esperar a que el DOM esté cargado y la API key esté disponible
document.addEventListener('DOMContentLoaded', () => {
    // Intentar inicializar cada 100ms hasta que la API key esté disponible
    const initInterval = setInterval(() => {
        if (window.OPENROUTER_API_KEY) {
            clearInterval(initInterval);
            initializeChatbot();
        }
    }, 100);

    // Timeout después de 5 segundos para evitar bucle infinito
    setTimeout(() => {
        clearInterval(initInterval);
        if (!window.OPENROUTER_API_KEY) {
            console.error('Error: No se pudo inicializar el chatbot después de 5 segundos.');
        }
    }, 5000);
});