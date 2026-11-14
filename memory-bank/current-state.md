# Current state

## Status
The app runs end to end. Frontend fetches /api/metrics once on mount and
renders five KPI cards and two charts. Both test suites exist and pass.

## What this handover added
- `.agents/rules` with four rules, each derived from a verified fact
- `memory-bank` with product, stack and this file
- `verification.md` with the trail of what was checked and corrected

## What the agent-skills branch added
- Four skills in `.agents/skills` (see stack.md, Agent skills)
- Accessibility, code splitting and a production image, applied one skill
  per commit

## Quality baseline
Do not regress any of this:
- Accessibility: one `<h1>` (dashboard-header.tsx); CardTitle renders an
  `<h2>`, used for the two chart titles. Each chart has an sr-only data
  table. Loading is announced with `role="status"`, errors with
  `role="alert"`. The skeleton stops animating with prefers-reduced-motion
- Performance: both charts load with React.lazy + Suspense in App.tsx; the
  Suspense fallback is itself a `role="status"`. computeKPIs adds up
  totals in a single pass. Last build: largest chunk 342.29 kB (Recharts),
  entry chunk 188.30 kB, no 500 kB warning
- Production: Dockerfile `production` target served by nginx (stack.md)

## How to verify a change
Run the dashboard-pre-merge-check skill
(`.agents/skills/dashboard-pre-merge-check/SKILL.md`). It lists the commands
per area changed, the invariants and the baseline above. Report what ran
and what could not run.

## Traps for the next agent
- No Prettier. App.tsx uses double quotes + semicolons; everything in
  components/dashboard uses single quotes + no semicolons. Match the file
  you are editing.
- Types in financial-types.ts use snake_case on purpose: they mirror the API
  payload. Renaming them to camelCase breaks the app silently at runtime.
- Backend tests depend on generate_mock_movements(seed=42). Changing the
  generator without updating assertions breaks them.
- mock-data.ts is dead code. It is not the data source.
- Keep `development` as the last stage of frontend/Dockerfile. Moving it
  changes the default target and breaks `docker compose up`.
- npm scripts run from `frontend/`; there is no package.json at the root.

## Open questions
- Are the 8 unused endpoints planned for future work, or leftovers?
- Should the header period be derived from the data instead of hardcoded?