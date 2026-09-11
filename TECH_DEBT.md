# Deuda técnica y pendientes — asistencia-web

Última actualización: 10 de septiembre, 2026 (revisión 3 — post refactor visual)

## ✅ Resuelto en el refactor visual

- **Navegación persistente**: `AppLayout` con header/nav real (Inicio, Mis Cursos, Mi Perfil, Salir) — ya no hay que escribir URLs a mano.
- **`AttendanceGrid` completamente reconstruido y con diseño nuevo** — regla "solo hoy editable" reconfirmada explícitamente contra un mockup que sugería lo contrario.
- **Sin Error Boundary → resuelto**: dos instancias (`App.tsx` genérico, `AppLayout` con `ServerErrorPage` como fallback).
- **Sin página 404 real → resuelto**: `NotFoundPage` construida (aunque no conectada a un catch-all de rutas todavía, ver pendientes).
- **Perfil sin "Últimos accesos" real → resuelto**: `SessionsList` con datos reales de Better Auth.
- **Reorganización de `courses/` → resuelto**: separado en `academic/` (catálogos), `courses/` (solo cursos), `students/` (solo estudiantes).
- **Dashboard (`/dashboard`) → resuelto**: pantalla real con saludo, tarjetas de curso, estado de asistencia del día — ya no es un simple redirect.
- **Bug real: registro sin campo de cédula pero backend lo exigía → resuelto** (confirmado que el backend ya no exige cédula; ambos lados alineados).
- **3 bugs reales de `mutateAsync`/caché encontrados y corregidos** — ver `CONTEXT.md`, gotchas 9-13.

## 🔴 Funcionalidad crítica pendiente

- **Catch-all de rutas (`<Route path="*">`) no existe** — `NotFoundPage` está construida pero nada la dispara automáticamente ante una URL inválida; hoy esas URLs probablemente muestran una pantalla en blanco del router, no la 404 real.
- **Sistema de alertas y resúmenes de asistencia**: solo indicadores visuales sueltos (punto de ausencias consecutivas, % de asistencia con resaltado de riesgo) — el panel de gestión completo (`Ver alertas`, CONANI, resolución con notas) sigue sin construirse, deferred desde el inicio del proyecto.
- **Resumen Anual de Asistencia**: mockup recibido y analizado, pero **deliberadamente no implementado** — con cero meses de historial real acumulado, cualquier vista mostraría datos vacíos o inventados. Retomar cuando exista suficiente historial real (varios meses de uso real del sistema).

## 🟠 Pantallas construidas pero sin disparador real conectado

- **`SessionExpiredPage`** (variante A del 401) — no hay mecanismo para distinguir "sesión que expiró" de "nunca inició sesión"; solo la variante B (`UnauthenticatedPage`) está conectada, vía `RequireAuth`.
- **`ForbiddenPage`** (403 genérico) — el único 403 real hoy es cuenta suspendida (con su propia pantalla dedicada); esta queda lista para cuando exista un sistema de roles/permisos real.
- **`MaintenancePage`** (503) — no existe ningún "modo mantenimiento" real en la infraestructura que la dispare.

## 🟡 Pendiente de investigar (no resuelto, no urgente)

- **TOTP falla en el primer intento del login incluso con tiempo suficiente en el código** — reproducido dos veces, luego dejó de reproducirse sin que se identificara la causa exacta. Se agregó logging instrumentado (`result.error.status`/`.code`) para capturar evidencia la próxima vez que ocurra.
- **Toast "Conexión restaurada" no llega a verse al volver de offline** — la recarga automática (1.2s después) sí ocurre correctamente; posible carrera entre el montaje del `<Toaster />` y el timing del `setTimeout` de recarga.

## 🟡 Simplificaciones conocidas (sin cambios desde la revisión anterior)

- **Navegación de mes en asistencia es una lista de los últimos 6 meses generada en el cliente**, no atada a fechas reales del año escolar.
- **No hay formulario para crear un año escolar nuevo** en la UI (el endpoint existe, sin control de rol del lado del backend tampoco).
- **Perfil sin "Información personal"** (centro educativo, director) — no existe ese backend.
- **"Últimos accesos" muestra el `userAgent` crudo del navegador**, sin parsear a formato amigable.
- **Sin geolocalización en las sesiones**.
- **Reactivar cuenta no pide contraseña** (a diferencia de suspender).
- **Validación de materia vs. nivel educativo solo en el cliente**.
- **Pestañas de tipo de evaluación (Completiva/Extraordinaria)** — backend soporta la columna `event_type`, frontend deliberadamente no la usa todavía.
- **Botones "Exportar resumen"/"Exportar reporte anual"** — nunca se construyeron, no existe generación de reportes.

## 🔵 Rendimiento / build

- Sin cambios — chunk principal sigue en el mismo orden de magnitud tras el refactor visual (no se midió de nuevo formalmente).

## 🧹 Otros

- **Sin tests** — sigue en cero, en todas las capas.
- **Sin auditoría de accesibilidad** formal, más allá de lo que corrige Biome automáticamente (varios `noLabelWithoutControl`, `aria-hidden` en SVGs decorativos, resueltos ad-hoc durante el desarrollo).
- **Branding cosmético mínimo** — favicon/íconos de Vite en algunos lugares, sin logo real de "Cuaderno Digital" como asset.
- **Diseño visual usa valores arbitrarios de Tailwind repetidos** (`bg-[#003087]`, etc.) en vez de theme tokens formales — deuda de mantenibilidad conocida y aceptada desde el inicio del refactor visual, no resuelta en esta revisión.
