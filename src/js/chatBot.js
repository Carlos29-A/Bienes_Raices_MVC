import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

function initializeChatbot() {
    if (!window.OPENROUTER_API_KEY) {
        console.error('Error: OPENROUTER_API_KEY no está configurada.');
        return;
    }

    const openRouter = createOpenRouter({
        apiKey: window.OPENROUTER_API_KEY
    });

    const SYSTEM_CONTEXT = ` Soy un asistente virtual especializado en el sistema de Bienes Raíces. Te ayudaré a entender cómo funciona cada parte del sistema:

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
`; // Tu contexto original aquí

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

            if (!window.OPENROUTER_API_KEY) {
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
                const resultado = await streamText({
                    model: openRouter('google/gemini-2.0-flash-exp:free'),
                    prompt: promptCompleto,
                    temperature: 0.7,
                    max_tokens: 1000,
                });

                let respuestaCompleta = '';

                for await (const text of resultado.textStream) {
                    respuestaCompleta += text;
                    typingIndicator.querySelector('p').textContent = respuestaCompleta;
                    scrollToBottom();
                }

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
        if (window.OPENROUTER_API_KEY) {
            clearInterval(initInterval);
            initializeChatbot();
        }
    }, 500); // Menos agresivo

    setTimeout(() => {
        clearInterval(initInterval);
        if (!window.OPENROUTER_API_KEY) {
            console.error('Error: No se pudo inicializar el chatbot después de 5 segundos.');
        }
    }, 5000);
});
