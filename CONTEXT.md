# asistencia-web — Documento de contexto para traspaso

Última actualización: 3 de septiembre, 2026

## Qué es este proyecto

Frontend de "Registro de Grado Digital", consumiendo la API descrita en `asistencia-api-CONTEXT.md` (mismo proyecto, repo hermano). Diseño fiel a mockups oficiales con branding MINERD (azul `#003087`, tipografía Inter, layout split-screen en pantallas de auth).

**Historia relevante**: existió un módulo de asistencia previo (`AttendanceGrid`) construido contra un backend viejo en español, con `sectionId` hardcodeado. **Ese módulo fue completamente reescrito y reemplazado** una vez existió el backend nuevo — no queda código del original.

## Stack técnico

- **React 19** + **TypeScript**, **Vite** (bundler)
- **React Router** (enrutamiento, con `React.lazy` + `Suspense` por página para code-splitting)
- **TanStack Query** (estado de servidor) — **no** TanStack Router
- **TanStack Table v8** (¡cuidado! la v9 tiene breaking changes de API, quedó pineado a v8 deliberadamente)
- **React Hook Form** + **Zod** (`@hookform/resolvers/zod`) para formularios
- **`better-auth/react`** (`createAuthClient`) — cliente oficial para todo lo relacionado a auth (login, 2FA, sesiones, cambio de contraseña/correo). **Nunca se reconstruyó esa lógica a mano.**
- **shadcn/ui sobre Base UI** (no Radix) — importante, ver Gotchas
- **Tailwind CSS v4** (config CSS-first, sin `tailwind.config.js`)
- **Biome** único linter/formatter

## Arquitectura: vertical slicing

```
src/
  features/
    auth/          → registro, login, 2FA, recuperación de contraseña, perfil, suspensión
    courses/         → cursos y estudiantes (CRUD completo)
    attendance/        → grilla de asistencia por curso
  shared/
    ui/                → componentes de shadcn/ui — NUNCA editados a mano, excluidos de Biome por completo
    lib/                  → http.ts (cliente con ApiError), logger.ts
```

Cada feature: `types.ts` → `api.ts` → `hooks.ts` (TanStack Query) → `components/` → `pages/`. **No hay capa `dto.ts`/`mappers.ts`** — el backend ya habla inglés, así que la respuesta de la API coincide 1:1 con el modelo de dominio del frontend (a diferencia del proyecto viejo, que necesitaba una capa anti-corrupción español↔inglés).

## Formato de respuesta consumido

```ts
// shared/lib/http.ts expone httpGet/httpPost/httpPatch/httpDelete,
// todos tipados, que lanzan ApiError (con .code y .details) si status !== "success".
```

`details` viene del backend como `{ field, message }[]` para errores de validación Zod — se usa con `form.setError(detail.field, ...)` de React Hook Form para mostrar el error exacto en el campo correspondiente.

## Diseño / sistema visual

No hay theme tokens formales de Tailwind — se usan **valores arbitrarios directos** (`bg-[#003087]`, `text-[#6b6b6b]`, etc.) repetidos en cada componente, a propósito, para no tocar las variables `--primary`/`--destructive` de shadcn (que otros componentes del proyecto siguen usando con sus defaults). Componentes de patrón reutilizado: `AuthLayout` (split-screen), `StatusBanner` (variant error/success/warning).

**Nota de deuda de diseño**: esto significa que si cambia el color de marca, hay que buscar y reemplazar en muchos archivos, no en un solo lugar. Aceptado conscientemente por velocidad de desarrollo.

## Mapa de rutas

```
/                        → redirige a /login
/login                     → login + paso 2FA (TOTP o código de recuperación)
/register                    → wizard de 2 pasos (perfil, confirmación) — SIN paso de verificación por cédula (existía en mockup, se quitó: no hay backend de "director pre-aprueba docente")
/verify-email                   → aviso post-registro
/forgot-password                  → solicitar + reenviar
/reset-password                     → nueva contraseña (token por URL)
/account-suspended                    → pantalla de reactivación (RequireAuth con checkSuspension=false, para evitar loop de redirección)
/profile                                → tabs: Cuenta / Seguridad / Zona de peligro (RequireAuth normal)
/courses                                  → lista de cursos (RequireAuth normal)
/courses/:courseId/students                 → lista/gestión de estudiantes
/courses/:courseId/attendance                 → grilla de asistencia
/dashboard                                      → redirige a /courses (nunca se diseñó un dashboard real)
```

`RequireAuth` valida sesión (`useSession` de Better Auth) y, opcionalmente (`checkSuspension` default `true`), llama `GET /teachers/me` y redirige a `/account-suspended` si `suspendedAt` está seteado.

## Features implementadas

### Auth
Registro (sin selector de materia real conectado — el backend de `/subjects` sí existe y se usa en el registro), login con 2FA completo (TOTP + backup code), recuperar/restablecer contraseña, perfil con 3 pestañas:
- **Cuenta**: cambiar correo/contraseña (vía `authClient` directo)
- **Seguridad**: activar/desactivar 2FA (con descarga real de backup codes como `.txt`), lista de sesiones reales (`authClient.listSessions()`/`revokeSession()`/`revokeOtherSessions()`)
- **Zona de peligro**: suspender cuenta (pide contraseña, cierra sesión, redirige a login) / reactivar

### Courses
Lista de cursos con selector de año escolar, crear/editar curso (`Sheet` lateral, con las reglas de negocio de encargado/área replicadas en el formulario), clonar cursos entre años, eliminar curso (soft delete, con `Dialog` de confirmación mostrando conteo de estudiantes activos), lista de estudiantes (ordenable por nombre/número), agregar/editar/retirar estudiante.

### Attendance
Grilla mensual por curso: columna de hoy editable (con `Select` de shadcn), resto de días bloqueados (candado ícono en pasado/futuro, 🚫 en no laborable), botón "Guardar" que desaparece tras enviar, indicador visual de "2+ ausencias consecutivas" (punto amarillo, calculado en cliente), columna de % de asistencia (calculado en cliente, umbral de color <80/80-90/>90), modal "Marcar día no laborable", navegación de mes (últimos 6 meses generados en cliente, sin depender de años escolares reales todavía), estudiantes retirados visibles con badge y bloqueo de edición en fechas posteriores a su retiro.

## ⚠️ Gotchas y lecciones aprendidas (leer antes de tocar código)

1. **Base UI, no Radix** — shadcn en este proyecto usa `@base-ui/react` como base. **Nunca usar `asChild`** (no existe en Base UI) — usar la prop `render={<Componente />}` en su lugar, en `TooltipTrigger`, `DialogTrigger`, `DropdownMenuTrigger`, etc.
2. **`SelectValue` de shadcn/Base UI no muestra la etiqueta automáticamente** — hay que pasarle una función como children: `<SelectValue>{(v) => opciones.find(...).label}</SelectValue>`. Sin esto, muestra el valor crudo (UUID, string interno), no el texto legible.
3. **`useRef()` sin argumento ya no compila** — versiones recientes de `@types/react` quitaron el overload sin argumentos. Usar `useRef<T | undefined>(undefined)` explícito.
4. **`"twoFactorRedirect" in data`, no `data?.twoFactorRedirect`** — Better Auth documenta explícitamente que el tipo de retorno de `signIn.email` no incluye esa propiedad aunque sí venga en runtime; hay que usar el operador `in` como type guard.
5. **`import.meta.dirname`, no `__dirname`**, en `vite.config.ts` — Vite está migrando a `configLoader: 'native'` y avisa sobre esto.
6. **Biome necesita overrides separados** para `src/shared/ui/**` (formatter+linter+assist **completamente desactivados**, porque `shadcn add` regenera esos archivos con su propio formato) vs `public/**` (solo reglas de accesibilidad desactivadas para SVGs estáticos). Mezclarlos en un solo override causó bugs reales durante el desarrollo.
7. **Confusión recurrente entre `hooks.ts` y `lib/auth-client.ts`** como fuente de un import — `useSession`/`signIn`/`signOut` vienen de `auth-client.ts` (cliente nativo de Better Auth), pero `useMyProfile` y cualquier hook de TanStack Query propio vive en `hooks.ts` de cada feature. Verificar siempre de cuál archivo se importa cada cosa.
8. **TanStack Table v9 tiene API incompatible con v8** — al instalar dependencias nuevas, confirmar que `@tanstack/react-table` sigue en `^8.x`, no se actualizó accidentalmente.

## Cómo correr localmente

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm run dev
```

Requiere que `asistencia-api` esté corriendo en paralelo.

## Deuda técnica y funcionalidad pendiente

Ver `TECH_DEBT.md` en la raíz del repo — cubre en detalle: navegación persistente ausente (no hay header/menú conectando las páginas, se navega por URL), sistema de alertas completo (solo hay indicadores visuales sueltos, no un panel de gestión), resumen anual, exportación PDF/CSV, y más.
