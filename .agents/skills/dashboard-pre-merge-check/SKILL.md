---
name: dashboard-pre-merge-check
description: Verificación obligatoria antes de hacer merge de un cambio en el dashboard financiero. Úsala al terminar de editar código en frontend/ o backend/.
---

# Pre-merge check del dashboard financiero

## Cuándo usarla

Al terminar cualquier cambio de código, antes de abrir o aprobar un pull request.

## Comandos que hay que correr

Si el cambio toca `frontend/`, desde la carpeta `frontend`:

    npm run build
    npm run lint
    npm test

Las tres tienen que pasar. `npm run build` corre `tsc -b` antes de Vite, así que un error de tipos se detiene ahí.

Si el cambio toca `backend/`, desde la raíz del repositorio:

    docker compose run --rm backend python -m pytest

Si el cambio toca `frontend/Dockerfile`, `frontend/nginx.conf` o `frontend/package.json`, desde la raíz del repositorio:

    docker build --target production -t financial-dashboard-frontend:production ./frontend

## Invariantes del repositorio

Un cambio que rompa cualquiera de estos se rechaza:

- Los tipos del frontend usan snake_case (`create_date`, `operation_type`) porque replican los campos de la API. No pasarlos a camelCase.
- El estilo de comillas y punto y coma se copia del archivo vecino. No hay Prettier en el repositorio, así que no se reformatean archivos que el cambio no toca.
- `frontend/src/lib/mock-data.ts` no lo importa nadie. No sirve como fuente de datos.
- Los tests del backend dependen de `generate_mock_movements(seed=42)`. Si cambia la semilla o la generación en `routes.py`, las aserciones se actualizan en el mismo commit.

## Línea base de accesibilidad

Un cambio no puede quitar nada de esto:

- Un solo `<h1>` en la página, con los títulos de las gráficas como `<h2>`.
- Cada gráfica conserva su tabla de datos equivalente.
- La carga se anuncia con `role="status"` y los errores con `role="alert"`.
- El skeleton deja de animarse con `prefers-reduced-motion`.

## Línea base de rendimiento

- Las gráficas se cargan con `React.lazy` y `Suspense`. No volver a importarlas de forma estática.
- Ningún chunk del build supera los 500 kB. Si el build muestra ese aviso, el cambio no está listo.

## Cómo reportar

Al terminar, decir qué comandos se corrieron y con qué resultado. Si alguno no se pudo correr, decirlo de forma explícita en vez de darlo por aprobado.
