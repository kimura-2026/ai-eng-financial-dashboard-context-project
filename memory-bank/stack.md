# Stack

Monorepo with two services, orchestrated by docker-compose.

## Frontend
- React + Vite + TypeScript, Tailwind CSS
- UI primitives follow shadcn (components.json); they live in components/ui
- Domain components live in components/dashboard
- Logic and types live in lib (financial-utils.ts, financial-types.ts)
- Alias `@/` maps to ./src/ (tsconfig.app.json and vite.config.ts)
- Tests with Vitest, placed next to the module they test (*.test.ts)
- Runs on port 5173

## Backend
- FastAPI, served by uvicorn with --reload
- app/main.py creates the app and mounts the router; CORS is open to "*"
- app/routes.py holds Pydantic models and all endpoints
- Tests with pytest in tests/, using TestClient and seed=42 for determinism
- Runs on port 8000; 5678 is exposed for debugpy

## How they connect
Vite proxies /api/* to http://backend:8000, resolved by the compose network.
If VITE_API_BASE_URL is set, the frontend calls that URL directly and the
backend CORS config applies.

## How to run
    docker compose up
Frontend at :5173, backend at :8000, health check at /health.