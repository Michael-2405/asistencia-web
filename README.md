# Cuaderno Digital — Web

Frontend del sistema de control de asistencia y calificaciones para docentes, consumiendo la API de [`asistencia-api`](https://github.com/Michael-2405/asistencia-api).

## Stack técnico

- **React 19** + **TypeScript**
- **Vite** como bundler
- **React Router** para enrutamiento
- **TanStack Query** para estado de servidor (caché, mutaciones, invalidación)
- **TanStack Table** para grillas de datos
- **React Hook Form** + **Zod** para formularios
- **Tailwind CSS v4** + **shadcn/ui** (Base UI) para componentes
- **Biome** como linter y formatter

## Requisitos previos

- Node.js 20+
- La API de este proyecto corriendo localmente ([asistencia-api](https://github.com/Michael-2405/asistencia-api)) — este frontend no funciona sin ella.

## Configuración

1. Instala las dependencias:

```bash
npm install
```

2. Copia el archivo de variables de entorno de ejemplo:

```bash
cp .env.example .env
```

```
VITE_API_URL=http://localhost:3000
```

3. Levanta el servidor de desarrollo:

```bash
npm run dev
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo de Vite |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run typecheck` | Verifica tipos sin emitir archivos |
| `npm run lint` | Corre el linter de Biome |
| `npm run format` | Formatea el código con Biome |
| `npm run check` | Corre lint + format checks juntos |
| `npm run check:write` | Aplica automáticamente los fixes de Biome |
| `npm run ci` | Verificación estricta para integración continua |

## Estructura del proyecto

El código sigue una organización por **vertical slicing**: cada carpeta bajo `features/` agrupa todo lo necesario para una capacidad de negocio (API, tipos, hooks, componentes), separada por el recurso real que gestiona.

```
src/
features/
auth/ # Registro, login, 2FA, recuperación de contraseña, perfil, suspensión
academic/ # Catálogos compartidos: materias, años escolares
courses/ # Solo cursos (crear, editar, clonar, desactivar)
students/ # Solo estudiantes (agregar, editar, retirar)
attendance/ # Grilla de asistencia por curso
dashboard/ # Pantalla de inicio (resumen de cursos y asistencia del día)
errors/ # Pantallas de error (401, 403, 404, 500, 503, offline)
shared/
ui/ # Componentes de shadcn/ui — nunca editados a mano
layouts/ # AppLayout (header + navegación persistente)
components/ # ErrorBoundary
lib/ # HTTP client, logger
hooks/ # useCountdown, useOnlineStatus, etc.
```

```
Cada feature de recurso (auth, courses, students, etc.) sigue el mismo patrón interno: `types.ts` → `api.ts` → `hooks.ts` → `components/` → `pages/`. Dentro de `components/`, se subdivide por flujo/página consumidora cuando hay suficientes archivos relacionados (ver `auth/components/{login,register,profile}/`).
```

Cada feature sigue el mismo patrón interno: `types.ts` → `api.ts` → `hooks.ts` (TanStack Query) → `components/` → `pages/`.

## Documentación adicional

- `CONTEXT.md` — arquitectura completa, mapa de rutas, gotchas conocidos.
- `TECH_DEBT.md` — deuda técnica y funcionalidad pendiente, priorizada.

## Estado del proyecto

En desarrollo activo. Módulos completos: autenticación (registro, login, 2FA, recuperación de contraseña, perfil), cursos y estudiantes, registro de asistencia. Próximo bloque: gestión de calificaciones.
