# 🏠 Sistema de Bienes Raíces - MVC

Un sistema completo de gestión de propiedades inmobiliarias desarrollado con Node.js, Express y Pug, que permite a compradores, vendedores y administradores gestionar propiedades de manera eficiente.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Funcionalidades](#-funcionalidades)
- [Accesibilidad](#-accesibilidad)
- [Chatbot IA](#-chatbot-ia)
- [API Endpoints](#-api-endpoints)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 👥 Tipos de Usuarios
- **Usuario Público**: Navegación libre, búsqueda y visualización de propiedades
- **Comprador**: Gestión de favoritos, mensajería, calificaciones
- **Vendedor**: Publicación y gestión de propiedades
- **Administrador**: Control total del sistema

### 🏠 Gestión de Propiedades
- Publicación con información completa (título, precio, descripción, características)
- Sistema de imágenes por propiedad
- Categorización por tipo (casa, departamento, terreno, etc.)
- Estados activo/inactivo
- Filtros avanzados de búsqueda

### 💬 Sistema de Comunicación
- Mensajería entre compradores y vendedores
- Historial de conversaciones
- Marcado de mensajes leídos/no leídos
- Respuestas a mensajes

### ⭐ Sistema de Calificaciones
- Calificación de vendedores (1-5 estrellas)
- Comentarios asociados
- Edición y eliminación de calificaciones propias
- Promedio de calificaciones en perfiles

### 🔍 Búsqueda y Filtros
- Filtros por ubicación, categoría, habitaciones, baños, estacionamiento, precio
- Búsqueda por texto en títulos
- Vista de mapa interactivo
- Resultados en tiempo real

### 🤖 Chatbot Inteligente
- Asistente virtual con IA (Google Gemini)
- Ayuda contextual sobre funcionalidades
- Respuestas en tiempo real
- Interfaz integrada

### ♿ Accesibilidad
- Sistema de comandos de voz
- Iconos de accesibilidad
- Navegación por teclado
- Diseño responsive

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **Multer** - Manejo de archivos
- **Bcrypt** - Encriptación de contraseñas
- **Express-validator** - Validación de datos
- **CSRF** - Protección contra ataques CSRF

### Frontend
- **Pug** - Motor de plantillas
- **Tailwind CSS** - Framework CSS
- **FontAwesome** - Iconografía
- **JavaScript Vanilla** - Interactividad del cliente

### IA y APIs
- **Google Gemini AI** - Chatbot inteligente
- **Google Maps API** - Mapas interactivos

### Herramientas de Desarrollo
- **Vite** - Build tool
- **Webpack** - Bundler
- **PostCSS** - Procesador CSS
- **Nodemon** - Auto-reload en desarrollo

## 📁 Estructura del Proyecto

```
Bienes_Raices_MVC/
├── config/                 # Configuración de base de datos
├── controllers/           # Controladores de la aplicación
├── helpers/              # Funciones auxiliares
├── middlewares/          # Middlewares personalizados
├── models/               # Modelos de Sequelize
├── public/               # Archivos estáticos
│   ├── css/             # Estilos CSS
│   ├── js/              # JavaScript del cliente
│   ├── img/             # Imágenes del sistema
│   ├── uploads/         # Imágenes subidas por usuarios
│   └── icons/           # Iconos y fuentes
├── routes/               # Definición de rutas
├── seed/                 # Datos de prueba
├── src/                  # Código fuente adicional
├── views/                # Plantillas Pug
│   ├── layout/          # Layouts principales
│   ├── partials/        # Componentes reutilizables
│   ├── public/          # Vistas públicas
│   ├── propiedades/     # Vistas de propiedades
│   ├── usuario/         # Vistas de usuarios
│   └── mensajes/        # Vistas de mensajería
├── index.js             # Punto de entrada
├── package.json         # Dependencias
└── README.md           # Este archivo
```

## 🚀 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Bienes_Raices_MVC
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**
```bash
# Crear base de datos en MySQL
CREATE DATABASE bienes_raices;
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

5. **Ejecutar migraciones y seeders**
```bash
npm run migrate
npm run seed
```

6. **Iniciar el servidor**
```bash
npm start
# o para desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=bienes_raices
DB_PORT=3306

SESSION_SECRET=tu_secret_key
CSRF_SECRET=tu_csrf_secret

GEMINI_API_KEY=tu_api_key_gemini
GOOGLE_MAPS_API_KEY=tu_api_key_maps

PORT=3000
NODE_ENV=development
```

### Configuración de Base de Datos
El archivo `config/db.js` contiene la configuración de Sequelize para conectar con MySQL.

## 📖 Uso

### Usuario Público
1. Navegar por las propiedades disponibles
2. Usar filtros de búsqueda
3. Ver detalles de propiedades
4. Registrarse como comprador o vendedor

### Comprador
1. Registrarse y confirmar email
2. Buscar propiedades con filtros
3. Guardar favoritos
4. Enviar mensajes a vendedores
5. Calificar vendedores

### Vendedor
1. Registrarse y confirmar email
2. Publicar propiedades
3. Gestionar publicaciones
4. Responder mensajes
5. Ver estadísticas

### Administrador
1. Acceder con credenciales especiales
2. Gestionar usuarios y propiedades
3. Administrar categorías
4. Supervisar mensajes
5. Ver estadísticas del sistema

## 🔧 Funcionalidades Detalladas

### Sistema de Autenticación
- Registro con validación de email
- Login seguro con bcrypt
- Protección de rutas por tipo de usuario
- Gestión de sesiones

### Gestión de Propiedades
- CRUD completo de propiedades
- Subida de imágenes
- Validación de datos
- Estados de publicación

### Sistema de Mensajería
- Envío de mensajes entre usuarios
- Respuestas a mensajes
- Historial de conversaciones
- Marcado de leído/no leído

### Sistema de Favoritos
- Guardar/eliminar favoritos
- Lista de propiedades favoritas
- Filtros en favoritos

### Sistema de Calificaciones
- Calificación de 1-5 estrellas
- Comentarios asociados
- Edición y eliminación
- Promedio de calificaciones

## ♿ Accesibilidad

### Características Implementadas
- **Comandos de Voz**: Sistema de audio para navegación
- **Iconos de Accesibilidad**: Indicadores visuales claros
- **Navegación por Teclado**: Control completo sin mouse
- **Diseño Responsive**: Adaptable a diferentes dispositivos
- **Contraste Adecuado**: Colores optimizados para legibilidad

### Comandos de Voz Disponibles
- Navegación entre secciones
- Acceso a funcionalidades principales
- Control del chatbot
- Gestión de favoritos y mensajes

## 🤖 Chatbot IA

### Características del Chatbot
- **IA Integrada**: Google Gemini 2.0 Flash
- **Contexto Específico**: Conocimiento del sistema de bienes raíces
- **Respuestas Concisas**: Máximo 3-6 líneas
- **Sin Formato Markdown**: Solo texto plano e iconos
- **Ayuda Contextual**: Información específica del sistema

### Funcionalidades
- Explicación de procesos del sistema
- Guía de uso para cada tipo de usuario
- Información sobre funcionalidades
- Respuestas en tiempo real

### Configuración
```javascript
// Configurar API Key de Gemini
window.GEMINI_API_KEY = 'tu_api_key';
```

## 🔌 API Endpoints

### Propiedades
- `GET /propiedades` - Listar propiedades
- `GET /propiedades/:id` - Ver propiedad específica
- `POST /propiedades` - Crear propiedad
- `PUT /propiedades/:id` - Actualizar propiedad
- `DELETE /propiedades/:id` - Eliminar propiedad

### Usuarios
- `GET /auth/login` - Página de login
- `POST /auth/login` - Autenticación
- `GET /auth/registro` - Página de registro
- `POST /auth/registro` - Crear cuenta

### Mensajes
- `GET /mensajes` - Listar mensajes
- `POST /mensajes` - Enviar mensaje
- `PUT /mensajes/:id` - Actualizar mensaje
- `DELETE /mensajes/:id` - Eliminar mensaje

### Favoritos
- `GET /favoritos` - Listar favoritos
- `POST /favoritos/:id` - Agregar/eliminar favorito

## 🎨 Diseño y UI/UX

### Paleta de Colores
- **Primario**: #FF6819 (Naranja)
- **Secundario**: #FF9F00 (Amarillo)
- **Neutro**: Grises y blancos

### Características de Diseño
- Diseño moderno y limpio
- Interfaz intuitiva
- Animaciones suaves
- Iconografía consistente
- Tipografía legible (Poppins)

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Cobertura
```bash
npm run test:coverage
```

## 📦 Scripts Disponibles

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "build": "npm run build:css",
  "build:css": "node build-css.js",
  "test": "jest",
  "migrate": "sequelize db:migrate",
  "seed": "node seed/seed.js"
}
```

## 🔒 Seguridad

### Medidas Implementadas
- Encriptación de contraseñas con bcrypt
- Protección CSRF
- Validación de datos con express-validator
- Sanitización de inputs
- Protección de rutas por tipo de usuario
- Validación de archivos subidos



## 👨‍💻 Autor

**Carlos** - Desarrollador Full Stack
**Kaleb** - Desarrollador Backend
**Gustavo** -  Desarrollador Fronted
**Adrian** -  Desarrollador Fronted
**Oswaldo** - Seguridad y Desarrollador Fronted 

## 🙏 Agradecimientos

- Google Gemini AI por el chatbot
- FontAwesome por los iconos
- Tailwind CSS por el framework de estilos
- La comunidad de Node.js y Express
---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella! 