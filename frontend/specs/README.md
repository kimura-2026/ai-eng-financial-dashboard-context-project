# Frontend Specs — Data Contract

All field names and parameters below were verified against the live FastAPI
docs at `/docs` on the running backend. Nothing here is assumed.

## Endpoints used

### GET /api/metrics/facets

No parameters.

Returns:

| Field | Type | Notes |
|---|---|---|
| `operation_types` | `string[]` | e.g. `["income"]` |
| `business_types` | `string[]` | e.g. `["B2B"]` |
| `categories` | `string[]` | e.g. `["suppliers"]` |
| `min_date` | `string` | `YYYY-MM-DD`, oldest date in dataset |
| `max_date` | `string` | `YYYY-MM-DD`, newest date in dataset |

### GET /api/metrics/alerts

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `threshold` | number | `0.3` | API minimum is `0`, no maximum |
| `group_by` | string | `month` | `day` \| `week` \| `month` |
| `start_date` | string \| null | — | `YYYY-MM-DD` |
| `end_date` | string \| null | — | `YYYY-MM-DD` |
| `business_type` | string \| null | — | `B2B` \| `B2C` |

Returns an array of:

| Field | Type |
|---|---|
| `period` | `string` |
| `outcome_total` | `number` |
| `baseline_average` | `number` |
| `increase_ratio` | `number` |

### GET /api/metrics/categories/top

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `operation_type` | string | `outcome` | `income` \| `outcome` |
| `limit` | integer | `5` | min 1, max 20 |
| `start_date` | string \| null | — | `YYYY-MM-DD` |
| `end_date` | string \| null | — | `YYYY-MM-DD` |
| `business_type` | string \| null | — | `B2B` \| `B2C` |

Returns an array of:

| Field | Type |
|---|---|
| `category` | `string` |
| `operation_type` | `string` |
| `total_amount` | `number` |

## Gaps between the PM request and the API

These are the points where the request assumes something the API does not
provide. Each one is resolved in the frontend.

1. **Category percentage does not exist.** The PM asks for "percentage of the
   group total" per category. `/api/metrics/categories/top` returns only
   `total_amount`. The frontend computes it: each row's `total_amount` divided
   by the sum of `total_amount` across the 5 returned rows.

2. **Threshold range differs.** The PM specifies a ratio between 0.01 and 1.0.
   The API enforces only `minimum: 0` with no upper bound. The frontend
   validates the 0.01–1.0 business range before calling.

3. **`increase_ratio` is a ratio, not a percentage.** The alerts table column
   is labelled as a percentage increase, so the value must be multiplied by
   100 at display time.

4. **B2B and B2C require two separate calls.** `business_type` accepts a single
   value per request, so the comparison view calls
   `/api/metrics/categories/top` twice.

## Correction to earlier documentation

The project memory-bank lists backend endpoints as `/summary`,
`/categories/top`, `/alerts`, `/b2b` and `/b2c`. Verified against `/docs`,
all of them carry the `/api/metrics` prefix.