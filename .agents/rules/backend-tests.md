---
title: "Deterministic backend tests"
description: "Backend tests rely on a fixed seed; keep generation reproducible."
globs:
  - "backend/**/*.py"
applicationType: autoAttached
---

backend/tests/test_routes.py asserts on data produced by
generate_mock_movements(seed=42). The seed makes the output reproducible.

Do not change the default seed or the generation logic in routes.py without
updating the affected assertions in the same change. If generation changes,
run the backend tests before finishing.