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
- frontend/Dockerfile has three stages. `development` is last, so it is the
  default that docker-compose uses (vite dev). `production-build` runs
  npm ci + npm run build; `production` serves dist with nginx:alpine
- frontend/nginx.conf: gzip, one-year immutable cache for hash-named assets,
  no-store for index.html, SPA fallback, and /api/ proxied to backend:8000

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
The production image is built from the `production` target; the exact
command is in the dashboard-pre-merge-check skill.

## Agent skills
Installed in .agents/skills. External ones are pinned in skills-lock.json.
- accessibility (addyosmani/web-quality-skills): WCAG 2.2 audit and fixes
- vercel-react-best-practices (vercel-labs/agent-skills): React performance
  rules. Rules that depend on Next.js or Server Components do not apply here
- web-perf (cloudflare/skills): loading performance, Core Web Vitals,
  Lighthouse. Nothing in it depends on Cloudflare hosting
- dashboard-pre-merge-check (internal): mandatory check before merging any
  change to frontend/ or backend/