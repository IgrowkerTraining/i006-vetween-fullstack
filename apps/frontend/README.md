# Frontend - Vetween Sistema de Gestión Veterinaria 🐾

Este módulo corresponde al **frontend del sistema de gestión veterinaria**, desarrollado como una Single Page Application (SPA).

La aplicación permite a los veterinarios administrar pacientes, responsables, visitas clínicas y vacunas, además de gestionar el perfil de la clínica y visualizar resúmenes clínicos generados por inteligencia artificial.

---

# Tecnologías utilizadas

- **React** 19.2.4
- **TypeScript** 5.8.2
- **Vite** 6.2.0
- **React Router DOM** 7.13.1
- **Tailwind CSS** 3.4.19

---

# Estructura del proyecto

```text
frontend
│
├── src
│ ├── assets        # Imágenes y recursos estáticos
│ ├── components    # Componentes reutilizables (common, clinical, patient, vaccine, forms, layout)
│ ├── constants     # Enums y rutas de la aplicación
│ ├── context       # AuthContext, ToastContext
│ ├── hooks         # Hooks personalizados (useAuth, useApi, useEditPatient…)
│ ├── pages         # Páginas de la aplicación
│ ├── routes        # AppRoutes, ProtectedRoute, PublicRoute
│ ├── services      # Capa de comunicación con la API REST
│ ├── types         # Declaraciones de tipos TypeScript
│ └── utils         # httpErrorHandler, storage, validation, sort
│
├── index.html
├── vite.config.ts
├── tailwind.config.cjs
├── package.json
└── README.md
```

---

# Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js (v18 o superior)
- npm
- Variables de entorno configuradas

---

# Instalación del proyecto

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

2. Entrar en la carpeta del frontend

```bash
cd apps/frontend
```

3. Instalar dependencias

```bash
npm install
```

---

# Variables de entorno

Crear un archivo `.env` en la raíz de la carpeta `frontend`.

Ejemplo:

```env
VITE_API_PRUEBA_URL=https://backend-vetween.onrender.com/api
VITE_API_PROD_URL=https://backend-vetween-produccion.onrender.com/api
```

Por defecto la aplicación utiliza `VITE_API_PRUEBA_URL`.

---

# Ejecutar la aplicación

Modo desarrollo local

- Para ejecutar el frontend en tu máquina local:

```bash
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:5175
```

Modo producción

- Para generar el build de producción:

```bash
npm run build
```

---

# Funcionalidades principales

La aplicación permite gestionar:

### Autenticación

- registro de clínicas y veterinarios
- login con generación y almacenamiento de token de acceso
- cierre de sesión y redirección automática al expirar el token

### Gestión de responsables

- listado de responsables (dueños de mascotas)
- registro de nuevos responsables
- edición y eliminación de responsables

### Gestión de pacientes

- listado de pacientes con búsqueda y orden
- registro de nuevos pacientes vinculados a un responsable
- edición y eliminación de pacientes
- vista de detalle con historial clínico, vacunas y visitas

### Gestión de visitas clínicas

- registro de visitas clínicas por paciente
- consulta del historial de visitas en línea de tiempo
- inactivación de visitas

### Gestión de vacunas

- registro de vacunas por paciente
- consulta del historial de vacunación en línea de tiempo

### Perfil y clínica

- edición del perfil profesional del veterinario
- edición de los datos de la clínica
- cambio de contraseña

### Inteligencia Artificial

- generación de **resúmenes clínicos automáticos** por paciente
- consulta de resúmenes generados

---

# Arquitectura del frontend

El frontend sigue una arquitectura por capas:

Pages → Hooks → Services → API REST

**Pages**

Contienen la estructura visual y la lógica de cada vista.

**Hooks**

Encapsulan la lógica reutilizable de llamadas a la API y manejo de estado.

**Services**

Centralizan todas las peticiones HTTP a la API REST (`api.ts`).

**Context**

Proveen estado global accesible en toda la aplicación (autenticación, notificaciones).

---

# Estado del proyecto

El frontend se encuentra en una versión funcional (**MVP**) que implementa las principales funcionalidades del sistema de gestión veterinaria, incluyendo autenticación, gestión de clínicas, veterinarios, pacientes, responsables, visitas, vacunas y visualización de resúmenes clínicos generados por IA.

---

# Autoría

Proyecto desarrollado por el equipo de frontend como parte del entrenamiento de Igrowker ISA.
