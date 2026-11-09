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