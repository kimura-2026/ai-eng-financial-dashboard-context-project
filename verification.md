# Rastro de verificación

## Fase 1

- ✅ Puertos 5173 (frontend) y 8000 (backend) — confirmado en docker-compose.yml
- ✅ CORS abierto con allow_origins=["*"] — confirmado en main.py
- ✅ El frontend solo consume /api/metrics (un único fetch) — confirmado en App.tsx