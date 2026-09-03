# Deuda técnica y pendientes — asistencia-web

Última actualización: 3 de septiembre, 2026

## 🔴 Funcionalidad crítica pendiente

- **`AttendanceGrid` (módulo de asistencia original) está completamente desconectado del backend nuevo.** Apunta al backend viejo en español, con `sectionId`/`schoolYearId` hardcodeados. No se puede usar hasta que el backend nuevo tenga el módulo `attendance` construido — en ese punto, este componente necesita reescritura completa contra el nuevo modelo de datos (inglés, multi-tenant).
- **No hay navegación persistente entre pantallas.** Login, `/courses`, `/profile` existen como rutas aisladas — no hay header/menú que las conecte. Hoy se navega escribiendo URLs a mano.
- **"Pasar lista" en las tarjetas de curso está permanentemente deshabilitado** — placeholder honesto hasta que exista el módulo de asistencia.
- **Sistema de alertas y resúmenes de asistencia** (badges de "alertas" en tarjetas de curso, regla del 80% de asistencia mínima) — nunca se construyó, deferred desde la fase de planning original junto con el resto de funcionalidad avanzada de `attendance`.

## 🟠 Robustez / manejo de errores

- **No hay Error Boundary global.** Un error de renderizado no capturado (como el bug real que encontramos con la ruta `/account-suspended` no registrada) produce una pantalla en blanco sin ningún mensaje — nada le dice al usuario que algo salió mal.
- **No hay página 404 real para rutas no coincidentes.** Mismo síntoma que el bug de arriba: cualquier URL que no matchee ninguna ruta muestra una pantalla en blanco, no un mensaje "página no encontrada".
- **Vista móvil de la grilla de asistencia (`AttendanceMobileList`) nunca se construyó** — se decidió el enfoque (tarjetas por estudiante en vez de tabla) hace mucho, pero quedó pendiente y ahora depende de que `AttendanceGrid` se reescriba de todas formas.

## 🟡 Simplificaciones conocidas

- **Perfil sin "Información personal"** (centro educativo, director) — omitido a propósito, no existe backend de escuelas/directores.
- **"Últimos accesos" muestra el `userAgent` crudo del navegador**, sin parsear a formato amigable ("Chrome · Windows") — falta una librería de parseo de user-agent.
- **Sin geolocalización en las sesiones** — el mockup mostraba ciudad aproximada; eso requeriría un servicio externo de geolocalización por IP, no implementado.
- **Reactivar cuenta no pide contraseña** (a diferencia de suspender) — misma asimetría documentada en el backend, decisión consciente pendiente de revisión.
- **Validación de materia vs. nivel educativo solo en el cliente** — mismo hueco que en el backend; el formulario filtra opciones, pero no hay una segunda verificación visual tras el envío.

## 🔵 Rendimiento / build

- **Chunk principal (`index-*.js`) sigue en ~497 KB** después del code-splitting por rutas — podría optimizarse más separando vendors grandes (TanStack, Radix/Base UI) en chunks propios, no es urgente.

## 🧹 Otros

- **Sin tests** — cero unit tests, cero tests de componentes, cero e2e.
- **Sin auditoría de accesibilidad** más allá de lo que shadcn/Base UI da por defecto.
- **Branding cosmético mínimo** — favicon e íconos siguen siendo los defaults de Vite en varios lugares.
