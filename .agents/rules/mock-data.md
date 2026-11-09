---
title: "mock-data.ts is not the data source"
description: "The dashboard reads live API data, not the local mock file."
globs:
  - "frontend/src/**/*.tsx"
  - "frontend/src/lib/mock-data.ts"
applicationType: autoAttached
---

frontend/src/lib/mock-data.ts exists but is not imported anywhere.
The dashboard gets its data from a single fetch to /api/metrics in App.tsx.

Do not treat mock-data.ts as the source of truth, and do not wire it into
components. If a change needs sample data, use the API response shape
defined in financial-types.ts.