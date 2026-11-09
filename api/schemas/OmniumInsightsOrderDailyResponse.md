# OmniumInsightsOrderDailyResponse

Daily order statistics for the Insights API, grouped by store.
One row per (date, store) bucket with non-zero activity.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID.
- `storeName`: string, nullable — The store name at the time of aggregation.
- `totalOrders`: integer (int32) — Number of unique orders for this (date, store). Counts original sales only — excludes ReturnOrder and Replacement order types.
- `clickAndCollectOrders`: integer (int32) — Number of unique orders with OrderType in {ClickAndCollect, Bopis}.
- `homeDeliveryOrders`: integer (int32) — Number of unique orders with OrderType in {Online, ShipFromStore}.
- `totalRevenue`: number (decimal) — Sum of order-line ExtendedPrice (incl. VAT). Excludes shipping and order-level surcharges.
- `totalRevenueExclVat`: number (decimal) — Sum of order-line ExtendedPriceExclTax (excl. VAT). Excludes shipping and order-level surcharges.
- `averageCartValue`: number (decimal) — TotalRevenue divided by TotalOrders for this bucket.
- `ordersByStatus`: List<[`OmniumInsightsOrderStatusCount`](OmniumInsightsOrderStatusCount.md)>, nullable — Unique order counts split by Order.Status, one entry per distinct status.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
