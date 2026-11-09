# Product

Financial dashboard for executive metrics. Single-page view, no auth,
no user accounts, no persistence.

## What it shows
- Four KPI cards: total income, total outcome, profit, profit margin
- A fifth card with the total number of movements
- Two charts: income vs outcome by month, and profit margin % by month

## Data
Financial movements (income/outcome, B2B/B2C) generated randomly by the
backend on request. Nothing is stored; each call returns new data.

## Known gaps
- The header period is hardcoded to "2024 - Full Year" in App.tsx while the
  generated data covers roughly the last 12 months.
- The backend exposes 9 endpoints; the frontend consumes only /api/metrics.