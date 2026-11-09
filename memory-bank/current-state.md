# Current state

## Status
The app runs end to end. Frontend fetches /api/metrics once on mount and
renders five KPI cards and two charts. Both test suites exist and pass.

## What this handover added
- `.agents/rules` with four rules, each derived from a verified fact
- `memory-bank` with product, stack and this file
- `verification.md` with the trail of what was checked and corrected

## Traps for the next agent
- No Prettier. App.tsx uses double quotes + semicolons; everything in
  components/dashboard uses single quotes + no semicolons. Match the file
  you are editing.
- Types in financial-types.ts use snake_case on purpose: they mirror the API
  payload. Renaming them to camelCase breaks the app silently at runtime.
- Backend tests depend on generate_mock_movements(seed=42). Changing the
  generator without updating assertions breaks them.
- mock-data.ts is dead code. It is not the data source.

## Open questions
- Are the 8 unused endpoints planned for future work, or leftovers?
- Should the header period be derived from the data instead of hardcoded?