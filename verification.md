# Rastro de verificación

## Fase 1

- ✅ Puertos 5173 (frontend) y 8000 (backend) — confirmado en docker-compose.yml
- ✅ CORS abierto con allow_origins=["*"] — confirmado en main.py
- ✅ El frontend solo consume /api/metrics (un único fetch) — confirmado en App.tsx

## Fase 2 — Hallazgos verificados

- ✅ Alias `@/` → `./src/` — confirmado en los imports de App.tsx y kpi-card.tsx
- ✅ Estilo inconsistente: App.tsx usa comillas dobles y `;`;
  kpi-card.tsx usa comillas simples y sin `;`. No hay Prettier en el repo.
- ✅ Los tipos del frontend usan snake_case (`create_date`, `operation_type`)
  porque replican los campos de la API. Cambiarlos a camelCase rompería la app.
- ✅ El frontend solo consume 1 de los 9 endpoints del backend
- ✅ `mock-data.ts` existe pero nadie lo importa
- ❓ El header muestra "2024 - Full Year" fijo en App.tsx, pero los datos
  del backend son de Oct 2025 a Oct 2026

  ## Fase 3 — Prueba de reglas

Tarea dada al agente: "Añade una quinta KPI card con el total de movimientos."
No se mencionaron las reglas.

Resultado:
- ✅ El agente leyó `.agents/rules` antes de editar
- ✅ kpi-row.tsx mantiene comillas simples y sin `;`, como el resto de la carpeta
- ✅ No tocó los campos snake_case de la API
- ✅ No usó mock-data.ts
- ✅ Actualizó el test de computeKPIs en el mismo cambio

## Proyecto de specs — Verificación contra /docs

Todos los nombres de campo y parámetros se comprobaron en la documentación
viva de FastAPI (`/docs`), con el backend corriendo.

### Correcciones

- ❌ El memory-bank listaba los endpoints como `/summary`, `/alerts`,
  `/categories/top`, `/b2b`, `/b2c`.
  ✅ Corrección: todos llevan el prefijo `/api/metrics`.

- ❌ El PM indicó que el umbral de alertas va de 0.01 a 1.0.
  ✅ La API solo impone `minimum: 0`, sin máximo. La restricción es de
  negocio, así que se valida en el frontend.

### Huecos detectados entre la petición y la API

- ❌ El PM pide "porcentaje sobre el total del grupo" por categoría.
  ✅ `/api/metrics/categories/top` no devuelve ese campo. Se calcula en el
  frontend dividiendo `total_amount` entre la suma del grupo.

- ❓ `increase_ratio` es un ratio, no un porcentaje. La columna debe
  multiplicarlo por 100 al mostrarlo.

- ❓ `business_type` acepta un solo valor por llamada, así que la vista
  comparativa necesita dos peticiones.

### Verificado correcto

- ✅ `/api/metrics/facets` no recibe parámetros y devuelve `min_date` y
  `max_date` en formato `YYYY-MM-DD`
- ✅ Campos de alertas: `period`, `outcome_total`, `baseline_average`,
  `increase_ratio`
- ✅ Campos de categorías: `category`, `operation_type`, `total_amount`
- ✅ `limit` admite de 1 a 20; `operation_type` por defecto es `outcome`