# Component Specs

Specification only. No implementation in this branch.

Field names come from `types.ts`, which was verified against `/docs`.
Component files follow the existing convention: kebab-case filenames in
`src/components/dashboard/`, single quotes, no semicolons.

---

## Feature 1 — Date range filter

### `DateRangeFilter`

Two date inputs at the top of the dashboard that filter every piece of data
on the page.

**Props**

| Prop | Type | Notes |
|---|---|---|
| `value` | `DateRange` | Current selection; either end may be `null` |
| `onChange` | `(next: DateRange) => void` | Fired on every valid change |
| `facets` | `MetricsFacets \| null` | `null` while loading |
| `loading` | `boolean` | Disables inputs while true |

**Behaviour**

- Renders two native date inputs labelled "From" and "To".
- Both are optional. When both are empty, no date parameters are sent and the
  dashboard shows the full dataset.
- Displays the available range as reference text near the inputs, using
  `facets.min_date` and `facets.max_date`.
- While `facets` is `null`, the reference text shows a placeholder, not a
  broken or empty string.
- Emits dates in `YYYY-MM-DD` format, matching `ApiDate`.

**Constraints**

- The user cannot select a start date later than the end date. If they do,
  the component shows an inline validation message and does not call
  `onChange`.
- Dates outside `min_date`–`max_date` are allowed but produce an empty result
  set; this is not treated as an error.
- Changing either input triggers a single refetch, not one per keystroke.

**Verification**

- [ ] Both inputs empty → request carries no `start_date` or `end_date`
- [ ] Only "From" set → request carries `start_date` only
- [ ] Start after end → inline message shown, no request fired
- [ ] Reference text matches `min_date` and `max_date` from the facets response
- [ ] Selected range is applied to the KPI cards, both charts and the alerts table

---

## Feature 2 — Anomaly alerts table

Sits below the existing charts. Highlights periods where spending rose
unexpectedly.

### `ThresholdInput`

**Props**

| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Ratio, default `0.3` |
| `onChange` | `(next: number) => void` | Fired on valid input only |

**Behaviour**

- Numeric input with step `0.01`.
- Default value is `0.3`.

**Constraints**

- Accepted range is `0.01`–`1.0` inclusive. This is a business rule: the API
  itself only enforces `minimum: 0` with no upper bound, so the limit must be
  applied in the UI.
- Out-of-range or non-numeric input shows an inline message and does not fire
  `onChange`; the last valid value stays in effect.

### `AnomalyAlertsTable`

**Props**

| Prop | Type | Notes |
|---|---|---|
| `alerts` | `MetricsAlert[]` | Rows returned by the API |
| `threshold` | `number` | Current ratio, shown in the empty state |
| `loading` | `boolean` | Shows skeleton rows while true |
| `error` | `string \| null` | Shows an error row when set |

**Behaviour**

Four columns, in this order:

| Column | Source | Display |
|---|---|---|
| Period | `period` | As returned |
| Outcome | `outcome_total` | Currency, same formatter as the KPI cards |
| 3-period average | `baseline_average` | Currency |
| Increase | `increase_ratio` | Percentage — multiply the ratio by 100 |

- Respects the active date range from Feature 1, passing `start_date` and
  `end_date` to the alerts endpoint.

**Constraints**

- When `alerts` is empty, the table renders an explicit empty state naming the
  current threshold, for example: "No anomalies above 30% for the selected
  period." The table must not disappear from the page.
- Loading state uses skeleton rows, matching the pattern already used in
  `kpi-card.tsx`.
- A failed request shows an error message in place of the rows, not a blank
  table.

**Verification**

- [ ] Four columns render in the specified order
- [ ] `increase_ratio` of `0.42` displays as `42%`
- [ ] Threshold `1.5` is rejected inline; no request fired
- [ ] Threshold `0.9` with no matching data → empty state names the threshold
- [ ] Table is still present on the page when there are zero alerts
- [ ] Setting a date range narrows the rows shown

---

## Feature 3 — B2B vs B2C comparison view

A new page in the dashboard comparing income performance across the two
business lines.

### `ComparisonPage`

**Behaviour**

- Two sections side by side: B2B on the left, B2C on the right.
- Below both, a single chart comparing total income for B2B against B2C.
- A `DateRangeFilter` (Feature 1) at the top filters the whole page.

**Data**

Requires two calls to `/api/metrics/categories/top`, because `business_type`
accepts a single value per request:

    /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
    /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C

`operation_type=income` must be passed explicitly; the API default is
`outcome`.

Available categories per group come from `/api/metrics/facets`.

### `BusinessLineTable`

Rendered once per business line.

**Props**

| Prop | Type |
|---|---|
| `breakdown` | `BusinessLineBreakdown \| null` |
| `loading` | `boolean` |

**Behaviour**

Three columns:

| Column | Source | Display |
|---|---|---|
| Category | `category` | As returned |
| Income | `total_amount` | Currency |
| Share | `share_of_group` | Percentage |

**Constraints**

- `share_of_group` is **not returned by the API**. It is computed in the
  frontend as `total_amount / group_total`, where `group_total` is the sum of
  `total_amount` across the five rows of that same group.
- The share is therefore relative to the top 5 of that line, not to all income
  for that line. The table must state this so the number is not misread.
- When `group_total` is `0`, every share renders as `0%`. Division by zero must
  not produce `NaN`.
- Shares are computed per business line independently; B2B shares sum to 100%
  and B2C shares sum to 100%.
- A line with no data shows an empty state in its own section; the other
  section still renders.

### `BusinessComparisonChart`

**Props**

| Prop | Type |
|---|---|
| `b2bTotal` | `number` |
| `b2cTotal` | `number` |
| `loading` | `boolean` |

**Constraints**

- Compares the two `group_total` values, so it reflects the top 5 categories
  per line, consistent with the tables above it.
- Uses the same chart library already present in
  `components/dashboard/income-outcome-chart.tsx`.

**Verification**

- [ ] Two calls are fired, one per `business_type`
- [ ] `operation_type=income` is present in both requests
- [ ] Each table shows at most 5 rows
- [ ] Shares within one table sum to 100%
- [ ] `group_total` of 0 renders `0%`, never `NaN`
- [ ] Changing the date range updates both tables and the chart
- [ ] One empty business line does not blank out the other section