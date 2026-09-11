# asistencia-web — Documento de contexto para traspaso

Última actualización: 10 de septiembre, 2026 (revisión 2 — post refactor visual)

## Qué es este proyecto

Frontend de "Cuaderno Digital", consumiendo la API descrita en `asistencia-api-CONTEXT.md` (repo hermano). Diseño propio, sin ninguna afiliación institucional — el proyecto se desligó deliberadamente de todo branding MINERD que tuvo en fases anteriores.

**Historia relevante**: el proyecto pasó por un refactor visual completo (esta revisión) que tocó prácticamente cada pantalla existente — no solo estética, sino manejo de errores, logging, y una reorganización real de la estructura de carpetas. Antes de este refactor, `features/courses/` contenía tanto cursos como estudiantes; ahora están separados.

## Stack técnico

- **React 19** + **TypeScript**, **Vite**
- **React Router**, con patrón de **layout route** (`AppLayout` envuelve las rutas protegidas vía `<Outlet />`, no cada página individualmente)
- **TanStack Query** — estado de servidor
- **TanStack Table v8** (¡nunca v9, breaking changes de API!)
- **React Hook Form** + **Zod**
- **`better-auth/react`** — todo lo de auth (login, 2FA, sesiones, cambio de contraseña/correo)
- **shadcn/ui sobre Base UI** (no Radix) — nunca `asChild`, usar `render={<Componente />}`
- **Tailwind CSS v4**
- **`sonner`** — toasts, montado una vez en `App.tsx`
- **Biome**

## Arquitectura: vertical slicing, con recursos separados por responsabilidad real

```
src/
  features/
    auth/          → registro, login, 2FA, recuperación de contraseña, perfil, suspensión
      components/
        shared/       → AuthLayout, PasswordInput, StatusBanner, StepIndicator, AuthSuccessScreen, etc.
        login/          → LoginCredentialsForm, TwoFactorVerifyForm
        register/        → RegisterProfileStep, RegisterConfirmStep, RegisterSuccess
        reset-password/  → ForgotPasswordRequestView, ForgotPasswordSentView, ResetPasswordForm
        profile/          → AccountSection, SecuritySection, TeacherConfigSection, DangerZoneSection,
                             ProfileSidebar, ChangeEmailDialog, ChangePasswordDialog, DisableTwoFactorDialog,
                             SuspendAccountDialog, TwoFactorSetup, SessionsList
      hooks/
        useProfile.ts     → useMyProfile, useSuspendAccount, useReactivateAccount
        usePasswordStrength.ts
    academic/        → NUEVO — catálogos compartidos (materias, años escolares). Antes vivía dentro de courses/.
    courses/          → solo cursos (ya no estudiantes)
      components/
        course-form/    → PillSelector (genérico, reutilizable), HomeroomToggle
        course-list/     → CourseCard, CourseListEmptyState
    students/          → NUEVO — separado de courses/, ciclo de vida propio
    attendance/          → grilla de asistencia por curso
    dashboard/            → NUEVO — pantalla de inicio real (antes solo redirigía a /courses)
    errors/                → NUEVO — las 8 pantallas de error del sistema
  shared/
    ui/                      → shadcn/ui, excluido de Biome por completo
    lib/                      → http.ts (con cache:"no-store"), logger.ts
    components/                → ErrorBoundary
    layouts/                     → AppLayout
    hooks/                        → useCountdown, useCountdownFrom, useOnlineStatus
```

**Regla de reorganización aplicada**: divide por página/flujo que consume el componente; si 2+ flujos comparten algo, va en `shared/`; no crear carpeta para un solo archivo (`VerifyEmailNotice.tsx` se quedó suelto en `auth/components/`, no en su propia carpeta).

**Criterio para dividir un componente grande**: solo si hay patrón repetido o pieza reutilizable en otro contexto — nunca por conteo de líneas. `CourseFormDialog` se dividió (4 grupos de botones con el mismo patrón visual → `PillSelector`); `CloneCoursesDialog` se quedó igual de grande a propósito (flujo secuencial cohesivo, sin duplicación real).

## Manejo de errores y logging

- **`shared/lib/logger.ts`**: `createLogger(scope)` con niveles `debug/info/warn/error`; `debug`/`info` se silencian en producción (`import.meta.env.PROD`).
- **`shared/components/ErrorBoundary.tsx`**: clase de React (no hay equivalente de hook nativo), acepta `renderFallback?: (error: Error) => ReactNode`. Hay **dos instancias**: una en `App.tsx` (fuera del router, fallback genérico, protección de último recurso) y otra dentro de `AppLayout` (envolviendo solo `<Outlet />`, con `renderFallback` apuntando a `ServerErrorPage` — así un error de página no tumba también el header/nav).
- **`sonner`**: para notificaciones transitorias sin ubicación fija (confirmaciones, errores de red). Complementa, no reemplaza, a `StatusBanner` (que sigue siendo para errores con contexto fijo dentro de un formulario).
- **`<Profiler>` nativo de React**: documentado como patrón para diagnosticar renders lentos en componentes pesados (ej. `AttendanceGrid`), no aplicado activamente todavía — solo el patrón quedó como referencia.

## Mapa de rutas

```
/                        → redirige a /login
/login                     → login + paso 2FA (TOTP o código de recuperación)
/register                    → wizard de 2 pasos (SIN paso de cédula/verificación por director)
/verify-email                   → aviso post-registro
/forgot-password                  → solicitar + reenviar
/reset-password                     → nueva contraseña (token por URL)
/account-suspended                    → RequireAuth con checkSuspension=false (evita loop de redirección)

── dentro de <AppLayout> (requiere sesión) ──
/dashboard                              → pantalla de inicio REAL (saludo, tarjetas de curso, estado de asistencia del día)
/profile                                  → sidebar de 4 secciones (Cuenta/Docente/Seguridad/Zona de peligro)
/courses                                    → lista de cursos
/courses/:courseId/students                   → lista/gestión de estudiantes
/courses/:courseId/attendance                   → grilla de asistencia
```

`AppLayout` incluye: header con nombre real del docente, nav (Inicio/Mis Cursos/Mi Perfil), franja de "sin conexión" (`useOnlineStatus`), y el `ErrorBoundary` interno.

## Features implementadas

### Auth
Sin cambios funcionales respecto a la revisión anterior, pero con **diseño nuevo completo**: `AuthLayout` de dos columnas con branding "Cuaderno Digital" (sin foto de fondo real, gradiente sólido — no hay imagen con derechos de uso disponible), spinner de carga real en submit, bordes rojos en campos con error. Perfil reestructurado de tabs a **sidebar de 4 secciones**, con nueva sección "Configuración docente" (nivel/tipo/materia, solo lectura). Últimos accesos ahora muestra sesiones reales vía `authClient.listSessions()`.

**Bug real corregido en este refactor**: el registro no pedía cédula, pero se confirmó que el backend tampoco la exige (columna eliminada previamente) — el formulario está alineado con el backend real, sin campo de cédula.

### Academic (nuevo feature, extraído de courses)
Solo `useSubjects`/`useSchoolYears` — catálogos de solo lectura usados por `courses`, `students`, y `auth` (registro).

### Courses / Students (separados)
CRUD completo de cursos (crear/editar vía `Dialog` centrado, ya no `Sheet` lateral; clonar entre años; desactivar — término correcto, es soft delete, no "eliminar"), CRUD completo de estudiantes (agregar/editar con validación visible de campos obligatorios, listar con orden alfabético+activos-primero opcional, fechas en formato `DD/MM/AAAA` sin pasar por `Date` para evitar bug de zona horaria, retirar con confirmación).

### Dashboard (nuevo)
Saludo contextual según hora del día, tarjetas de curso con estado de asistencia de hoy (`GET /courses/attendance-status`, endpoint nuevo agregado en esta revisión), banner de "cursos pendientes de pasar lista", resumen de estudiantes a cargo. **Deliberadamente sin**: notificaciones, alertas, período académico (no existen esos modelos).

### Attendance
Grilla mensual: **regla confirmada de nuevo — solo hoy es editable, bloqueado después** (el mockup de esta revisión sugería "cualquier día editable", se descartó explícitamente para mantener consistencia con el backend). Selector de estado ahora es un menú emergente (`TodayStatusPicker`, antes un `<Select>` nativo). Pie de totales de la sección agregado. % de asistencia siempre visible (una sola grilla para ambos niveles, decisión de hace varias sesiones).

### Errors (nuevo feature completo)
8 pantallas: 401 (2 variantes: sesión expirada / no autenticado — **solo la segunda está conectada**, la primera no tiene forma de dispararse todavía), 403 (genérico, construido pero sin conectar — el único 403 real hoy es cuenta suspendida, que tiene su propia pantalla), 404, 500 (conectado como `renderFallback` del `ErrorBoundary` interno de `AppLayout`), 503/mantenimiento (construida, sin trigger real), offline (conectada de verdad vía `useOnlineStatus`, con toast de reconexión), banner inline 400/409 (ya existía como `StatusBanner`, sin componente nuevo).

## ⚠️ Gotchas y lecciones aprendidas — actualizado con esta revisión

1. **Base UI, no Radix** — nunca `asChild`, usar `render={<Componente />}`.
2. **`SelectValue` necesita función como children** para mostrar el label — no lo hace automático.
3. **`useRef()` sin argumento ya no compila** — usar `useRef<T | undefined>(undefined)`.
4. **`"twoFactorRedirect" in data`, no `data?.twoFactorRedirect`** — limitación de tipos documentada por Better Auth.
5. **`import.meta.dirname`, no `__dirname`**, en `vite.config.ts`.
6. **Biome necesita overrides separados** para `src/shared/ui/**` (todo desactivado) vs `public/**` (solo a11y).
7. **`useSession`/`signIn`/`signOut` vienen de `lib/auth-client.ts`; `useMyProfile` y hooks de TanStack Query propios vienen de `hooks.ts`/`hooks/` de cada feature** — confusión recurrente entre ambos.
8. **TanStack Table v9 rompe la API de v8** — confirmar que la dependencia no se actualizó sola.
9. **`authClient` (Better Auth) NUNCA lanza excepción, ni con la red completamente caída** — devuelve `{ data: null, error: { status: 0 } }` incluso ante `ECONNREFUSED`. Un `try/catch` alrededor de una llamada a `authClient` casi nunca atrapa nada; siempre desestructurar `{ error }` y verificarlo explícitamente, igual que ya se hacía con `signIn.email`.
10. **`useMutation`'s `onSuccess` bloquea la resolución de `mutateAsync` si devuelve una promesa.** `onSuccess: () => queryClient.invalidateQueries(...)` (expresión, retorna la promesa de la revalidación) hace que quien llama `await mutateAsync(...)` espere el refetch completo antes de continuar — causó que diálogos no se cerraran "al instante". Arreglo: `onSuccess: () => { queryClient.invalidateQueries(...); }` (bloque, no retorna nada).
11. **Un `304 Not Modified` no trae cuerpo — `res.json()` explota si se llama sin comprobarlo.** `httpGet` usa `fetch(..., { cache: "no-store" })` para que el navegador nunca dependa de su propia caché HTTP (ya se tiene TanStack Query como caché); evita este problema de raíz.
12. **Un hook que depende de otro con un parámetro requerido (`useCourse` → `useCourses(schoolYearId)`) rompe silenciosamente si alguien lo llama sin ese parámetro** — `enabled: Boolean(schoolYearId)` hace que la query nunca se dispare, sin ningún error visible. `useCourse(courseId)` usa `useAllCourses()` (sin año) deliberadamente, porque necesita encontrar un curso sin saber de antemano en qué año escolar está.
13. **Cuando un componente padre decide si un hijo se monta o no (`{isOnline ? <A/> : <B/>}`), la lógica de "reaccionar al cambio" de esa condición debe vivir en el padre, no en el hijo** — el hijo se desmonta antes de que su propio `useEffect` alcance a dispararse. Aplica a `OfflinePage`/`AppLayout` con la detección de reconexión.
14. **Al reescribir un archivo central completo (`server.ts`) en vez de dar un diff puntual, es fácil perder algo que no estaba a la vista en ese momento** — causó que `attendanceRouter` dejara de montarse por varios mensajes sin que nadie lo notara hasta que las rutas de asistencia empezaron a dar 404. Preferir diffs puntuales sobre archivos grandes que acumulan piezas con el tiempo.

## Cómo correr localmente

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm run dev
```

## Deuda técnica y funcionalidad pendiente

Ver `TECH_DEBT.md`.
