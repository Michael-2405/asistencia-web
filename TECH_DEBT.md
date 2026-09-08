# Deuda técnica y pendientes — asistencia-web

Última actualización: 3 de septiembre, 2026 (revisión 2)

## ✅ Resuelto desde la última revisión

- **`AttendanceGrid` reconstruido por completo contra el backend real.** Ya no depende del backend viejo ni de datos simulados — `api.ts` hace llamadas HTTP reales al contrato de `attendance` que existe en `asistencia-api`.
- **"Pasar lista" en las tarjetas de curso ya funciona** — navega a `/courses/:courseId/attendance` con datos reales.
- **Estudiantes retirados vuelven a aparecer en la grilla de asistencia** (con badge "RETIRADO" y bloqueo visual en fechas posteriores a su retiro), corrigiendo una regresión que se había introducido sin querer durante el desarrollo con datos simulados.
- **Documentación de traspaso** (`CONTEXT.md`) creada.

## 🔴 Funcionalidad crítica pendiente

- **No hay navegación persistente entre pantallas.** Login, `/courses`, `/profile` existen como rutas aisladas — no hay header/menú que las conecte. Se navega escribiendo URLs a mano o desde botones puntuales dentro de cada página.
- **Sistema de alertas y resúmenes de asistencia**: solo existen los indicadores visuales sueltos en la grilla (punto de ausencias consecutivas, % de asistencia con color) — el panel de gestión completo (detección de CONANI, riesgo de completiva, resolución con notas) nunca se construyó, deferred desde la planificación original.
- **Resumen anual de asistencia y botones de exportación (PDF/CSV)** — no existen, mockups de referencia sin implementar.

## 🟠 Robustez / manejo de errores

- **No hay Error Boundary global.** Un error de renderizado no capturado produce una pantalla en blanco sin ningún mensaje (bug real que encontramos con `/account-suspended` antes de registrar la ruta).
- **No hay página 404 real** para rutas no coincidentes — mismo síntoma, pantalla en blanco.
- **Vista móvil de la grilla de asistencia nunca se construyó** — decisión tomada hace mucho, pendiente.

## 🟡 Simplificaciones conocidas

- **Navegación de mes en la grilla de asistencia es una lista de los últimos 6 meses generada en el cliente**, no está atada a las fechas reales del año escolar activo — a diferencia del selector de "Mis Cursos", que sí usa años escolares reales de la base de datos.
- **No hay formulario para crear un año escolar nuevo** en la UI — el endpoint (`POST /school-years`) existe en el backend, pero nunca se construyó la pantalla; coincide con la falta de control de rol del lado del backend (cualquiera podría crear años escolares vía API directa).
- **Perfil sin "Información personal"** (centro educativo, director) — omitido a propósito, no existe backend de escuelas/directores.
- **"Últimos accesos" muestra el `userAgent` crudo del navegador**, sin parsear a formato amigable.
- **Sin geolocalización en las sesiones**.
- **Reactivar cuenta no pide contraseña** (a diferencia de suspender) — misma asimetría documentada en el backend.
- **Validación de materia vs. nivel educativo solo en el cliente** — mismo hueco que en el backend.
- **Pestañas de tipo de evaluación (Completiva/Extraordinaria) en Secundaria** — decidido explícitamente dejarlas fuera de esta pasada; el backend ya soporta la columna `event_type` cuando se retome.

## 🔵 Rendimiento / build

- **Chunk principal (`index-*.js`) sigue en ~497 KB** después del code-splitting por rutas — optimizable, no urgente.

## 🧹 Otros

- **Sin tests** — cero unit tests, cero tests de componentes, cero e2e.
- **Sin auditoría de accesibilidad** más allá de lo que shadcn/Base UI da por defecto.
- **Branding cosmético mínimo** — favicon e íconos siguen siendo los defaults de Vite en varios lugares.