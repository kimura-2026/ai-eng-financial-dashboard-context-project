---
title: "Frontend code style"
description: "Match the style of the file being edited; do not reformat unrelated lines."
globs:
  - "frontend/src/**/*.tsx"
  - "frontend/src/**/*.ts"
applicationType: autoAttached
---

This repo has no Prettier config. Style is inconsistent between files:
App.tsx uses double quotes and semicolons; kpi-card.tsx uses single quotes
and no semicolons.

When editing a file, match the quote and semicolon style already used in
that same file. Do not reformat lines you were not asked to change.
Do not add a formatter config unless explicitly asked.