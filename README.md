# Asistencia Web

Aplicación web para digitalizar el registro de control de asistencia y puntualidad de MINERD (Ministerio de Educación de la República Dominicana). Permite a un docente visualizar la asistencia mensual de una sección, tomar asistencia del día actual y marcar días no laborables fuera del calendario oficial.

## Stack técnico

- **React 19** + **TypeScript**
- **Vite** como bundler
- **TanStack Query** para estado de servidor (caché, mutaciones, invalidación)
- **TanStack Table** para la grilla de asistencia
- **Tailwind CSS v4** + **shadcn/ui** (Base UI) para componentes
- **Biome** como linter y formatter

## Requisitos previos

- Node.js 20+
- La API de este proyecto corriendo localmente ([asistencia-api](../asistencia-api)) — este frontend no funciona sin ella.

## Configuración

1. Instala las dependencias:

```bash
   npm install
```

2. Copia el archivo de variables de entorno de ejemplo y ajusta según tu entorno:

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

El código sigue una organización por **vertical slicing**: cada carpeta bajo `features/` agrupa todo lo necesario para una capacidad de negocio (API, tipos, hooks, componentes), en vez de separar por tipo técnico.

```
src/
  features/
    attendance/       # Ver y registrar asistencia de una sección
    sections/          # Selección de curso/sección
    school-year/        # Año escolar, calendario y navegación de meses
  shared/
    ui/                # Componentes de shadcn/ui
    lib/                # HTTP client, logger
```


Cada feature sigue el mismo patrón interno:

- `dto.ts` — formas crudas tal como las devuelve el backend (en español, sin traducir).
- `types.ts` — modelo de dominio interno, en inglés.
- `mappers.ts` — traduce entre `dto` y `types` (capa anti-corrupción).
- `api.ts` — llamadas HTTP tipadas.
- `hooks.ts` — hooks de TanStack Query, dueños del estado de servidor.
- `components/` — componentes de presentación, sin lógica de datos propia.

## Estado del proyecto

Proyecto en desarrollo activo. El backend (`asistencia-api`) actualmente vive en un repositorio separado y está siendo reestructurado antes de su primera versión pública.

- La API de este proyecto corriendo localmente ([asistencia-api](https://github.com/tu-usuario/asistencia-api)) — este frontend no funciona sin ella.
