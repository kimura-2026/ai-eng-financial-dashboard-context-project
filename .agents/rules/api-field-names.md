---
title: "Keep snake_case on API-facing types"
description: "Frontend domain types mirror the API payload and must stay snake_case."
globs:
  - "frontend/src/lib/financial-types.ts"
  - "frontend/src/lib/financial-utils.ts"
applicationType: autoAttached
---

Fields in financial-types.ts use snake_case (create_date, operation_type)
because they map directly to the FastAPI response defined in
backend/app/routes.py.

Do not rename these fields to camelCase. Renaming them breaks the runtime
mapping between the API response and the dashboard, and TypeScript will not
catch it because the data arrives as JSON at runtime.