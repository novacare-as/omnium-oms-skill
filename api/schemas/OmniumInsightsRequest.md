# OmniumInsightsRequest

Common request parameters for Insights API endpoints.
Used to filter daily aggregated data by date range and optionally by store.

**Fields:**

- `fromDate`: string (date-time) — Start of the date range (inclusive), in the tenant's timezone.
- `toDate`: string (date-time) — End of the date range (inclusive), in the tenant's timezone.
- `storeId`: string, nullable — Optional internal Omnium store ID to filter results to a single store.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
