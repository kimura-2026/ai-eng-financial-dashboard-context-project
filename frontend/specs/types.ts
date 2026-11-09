// Types for the three new dashboard features.
// Field names mirror the API payload exactly (snake_case), as required by
// .agents/rules/api-field-names.md. Do not rename them to camelCase.
// Verified against /docs on the running backend.

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Date in YYYY-MM-DD format, as accepted and returned by the API. */
export type ApiDate = string

export type BusinessType = 'B2B' | 'B2C'
export type OperationType = 'income' | 'outcome'
export type GroupBy = 'day' | 'week' | 'month'

/** Date range selected by the user. Both ends are optional. */
export interface DateRange {
  start_date: ApiDate | null
  end_date: ApiDate | null
}

// ---------------------------------------------------------------------------
// Feature 1 — Date range filter
// GET /api/metrics/facets
// ---------------------------------------------------------------------------

export interface MetricsFacets {
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: string[]
  /** Oldest date present in the dataset. */
  min_date: ApiDate
  /** Newest date present in the dataset. */
  max_date: ApiDate
}

// ---------------------------------------------------------------------------
// Feature 2 — Anomaly alerts table
// GET /api/metrics/alerts
// ---------------------------------------------------------------------------

export interface AlertsQuery extends DateRange {
  /** Ratio. API allows >= 0; the UI restricts it to 0.01–1.0. */
  threshold: number
  group_by: GroupBy
  business_type: BusinessType | null
}

export interface MetricsAlert {
  /** Period label as returned by the API, e.g. "2026-03". */
  period: string
  outcome_total: number
  baseline_average: number
  /** Ratio, not a percentage. Multiply by 100 for display. */
  increase_ratio: number
}

// ---------------------------------------------------------------------------
// Feature 3 — B2B vs B2C comparison
// GET /api/metrics/categories/top
// ---------------------------------------------------------------------------

export interface TopCategoriesQuery extends DateRange {
  operation_type: OperationType
  /** API range: 1–20. The comparison view uses 5. */
  limit: number
  business_type: BusinessType | null
}

export interface TopCategoryItem {
  category: string
  operation_type: OperationType
  total_amount: number
}

/**
 * Row rendered in the comparison tables.
 * `share_of_group` is NOT returned by the API. It is computed in the frontend
 * as total_amount / sum(total_amount of the rows in the same group).
 * Value is a ratio in 0–1; multiply by 100 for display.
 */
export interface CategoryShareRow extends TopCategoryItem {
  share_of_group: number
}

/** One side of the comparison view. */
export interface BusinessLineBreakdown {
  business_type: BusinessType
  rows: CategoryShareRow[]
  /** Sum of total_amount across `rows`. Computed in the frontend. */
  group_total: number
}