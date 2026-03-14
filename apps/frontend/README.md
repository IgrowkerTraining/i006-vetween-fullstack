# Frontend - Vetween Sistema de Gestión Veterinaria 🐾

Aplicación web para la gestión clínica veterinaria. Permite a veterinarios administrar pacientes, responsables, visitas, vacunas y perfiles de clínica, con soporte de resúmenes clínicos generados por IA.

---

## Tecnologías

| Herramienta      | Versión |
| ---------------- | ------- |
| React            | 19.2.4  |
| TypeScript       | 5.8.2   |
| Vite             | 6.2.0   |
| React Router DOM | 7.13.1  |
| Tailwind CSS     | 3.4.19  |

---

## Requisitos previos

- Node.js >= 18
- pnpm o npm

---

## Configuración

Crear un archivo `.env` en la raíz de `/apps/frontend/` con las siguientes variables:

```env
VITE_API_PRUEBA_URL=https://backend-vetween.onrender.com/api
VITE_API_PROD_URL=https://backend-vetween-produccion.onrender.com/api
```

Por defecto la app usa `VITE_API_PRUEBA_URL`.

---

## Scripts

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5175)
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## Estructura del proyecto

```
src/
├── assets/              # Imágenes y recursos estáticos
├── components/
│   ├── clinical/        # Historial clínico y timeline de visitas
│   ├── common/          # Componentes reutilizables (Button, Input, Modal, Toast, Skeleton…)
│   ├── forms/           # Formularios (paciente, responsable, visita, vacuna)
│   ├── layout/          # MainLayout, Sidebar
│   ├── patient/         # Vista de paciente, tabs, modales de visita
│   └── vaccine/         # Historial y timeline de vacunas
├── constants/           # Enums y rutas de la aplicación
├── context/             # AuthContext, ToastContext
├── hooks/               # useAuth, useApi, useAuthApi, useEditPatient, useEditResponsible
├── pages/               # Páginas de la aplicación (ver sección Páginas)
├── routes/              # AppRoutes, ProtectedRoute, PublicRoute
├── services/            # api.ts — capa de comunicación con la API REST
├── types/               # Declaraciones de tipos TypeScript
└── utils/               # httpErrorHandler, storage, validation, sort
```

---

## Páginas

| Ruta                            | Componente                          | Descripción                                                                   |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| `/login`                        | `Login.tsx`                         | Autenticación con email y contraseña                                          |
| `/register`                     | `Register.tsx`                      | Registro de veterinario y clínica                                             |
| `/responsables`                 | `ResponsibleList.tsx`               | Listado de responsables (dueños de mascotas)                                  |
| `/register-patient`             | `ResponsibleAndPatientRegister.tsx` | Alta combinada de responsable y paciente                                      |
| `/lista-pacientes`              | `PatientList.tsx`                   | Listado de pacientes con búsqueda, orden y acciones                           |
| `/patient/:id`                  | `PatientDetail.tsx`                 | Detalle del paciente: datos, historial clínico, vacunas, visitas y resumen IA |
| `/resumen-clinico`              | `ClinicalSummaryList.tsx`           | Listado de resúmenes clínicos generados por IA                                |
| `/resumen-clinico/detail/:id`   | `ClinicalSummaryDetail.tsx`         | Detalle de un resumen clínico                                                 |
| `/mi-cuenta`                    | `MyAccount.tsx`                     | Hub de cuenta del veterinario                                                 |
| `/mi-cuenta/perfil-profesional` | `ProfessionalProfile.tsx`           | Editar datos profesionales                                                    |
| `/mi-cuenta/clinica`            | `ClinicProfile.tsx`                 | Editar datos de la clínica                                                    |
| `/mi-cuenta/seguridad`          | `SecurityProfile.tsx`               | Cambio de contraseña                                                          |

---

## Autenticación

- Se utiliza **JWT** almacenado en `localStorage`.
- El contexto `AuthContext` restaura la sesión al cargar la aplicación.
- Un interceptor global de `fetch` agrega el header `Authorization: Bearer <token>` en cada petición autenticada.
- Los errores 401 cierran la sesión automáticamente y redirigen al login.
- Las rutas protegidas usan `ProtectedRoute`; las rutas públicas usan `PublicRoute`.

---

## Capa de servicios (`api.ts`)

Todas las llamadas a la API se centralizan en el objeto `api` de `src/services/api.ts`. Los métodos principales son:

| Método                              | Descripción                               |
| ----------------------------------- | ----------------------------------------- |
| `login()`                           | Autenticar usuario                        |
| `register()`                        | Crear cuenta de veterinario y clínica     |
| `getPatients(page)`                 | Listar pacientes paginados                |
| `getPatientById(id)`                | Obtener detalle de un paciente            |
| `createPatient()`                   | Crear paciente                            |
| `updatePatient(id, data)`           | Editar paciente                           |
| `deletePatient(id)`                 | Eliminar paciente                         |
| `getResponsables(page)`             | Listar responsables paginados             |
| `createResponsable(data)`           | Crear responsable                         |
| `updateResponsable(id, data)`       | Editar responsable                        |
| `deleteResponsable(id)`             | Eliminar responsable                      |
| `getVisitasByPatientId(id)`         | Obtener visitas de un paciente            |
| `createVisita(data)`                | Registrar visita clínica                  |
| `getVacunasByPatientId(id)`         | Obtener vacunas de un paciente            |
| `createVacuna(data)`                | Registrar vacuna                          |
| `getClinic(token)`                  | Obtener datos de la clínica               |
| `updateClinic(data, token)`         | Actualizar datos de la clínica            |
| `getVeterinarian(id, token)`        | Obtener perfil del veterinario            |
| `changePassword(data, token)`       | Cambiar contraseña                        |
| `generateClinicalSummary(data)`     | Generar resumen clínico con IA            |
| `getClinicalSummaryByPatientId(id)` | Obtener resúmenes clínicos de un paciente |

---

## Manejo de errores

- `HttpError`: clase personalizada que extiende `Error` con código de estado HTTP.
- `installFetchInterceptor()`: envuelve el `fetch` global con timeout de 10 segundos, manejo de errores y notificaciones via Toast.
- `runWithoutToast(fn)`: permite suprimir el Toast en llamadas específicas.
- Mensajes contextuales para errores 401, 403, 404, 408, 500, 502 y 503.

---

## Hooks personalizados

| Hook                   | Descripción                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `useAuth()`            | Estado de autenticación y métodos `login` / `logout`        |
| `useApi<T>()`          | Estado genérico de llamadas API: `data`, `loading`, `error` |
| `useAuthApi()`         | Métodos de autenticación (login, register, healthcheck)     |
| `useEditPatient()`     | Lógica de edición de paciente con modal de confirmación     |
| `useEditResponsible()` | Lógica de edición de responsable con modal de confirmación  |

---

## Despliegue

El proyecto incluye configuración para:

- **Docker**: `Dockerfile` + `nginx.conf` para servir la build estática.
- **Vercel**: `vercel.json` para despliegue directo.

```bash
# Build de producción
npm run build

# Levantar con Docker (desde la raíz del monorepo)
docker-compose up frontend
```
