# OmniumInsightsOrderStatusCount

Order count grouped by a single Order.Status value, for use within an order insights bucket.

**Fields:**

- `status`: string, nullable — Order.Status value in PascalCase (e.g. "Completed", "Cancelled").
- `count`: integer (int32) — Number of unique orders with this status in the parent (date, store) bucket.
