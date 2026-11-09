# OmniumInsightsReturnDailyResponse

Daily return statistics for the Insights API.
Rows are bucketed by OrderLine.ReturnDate (when the line was returned), not by the original order date.
StoreId is the original order's store, not the return warehouse.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID for the original order.
- `returnCount`: integer (int32) — Number of unique returns (by ReturnOrder.ReturnOrderId) on this day.
- `returnValue`: number (decimal) — Sum of pro-rated returned line value (ReturnQuantity / Quantity × ExtendedPrice), incl. VAT, absolute value.
- `returnRate`: number (decimal) — ReturnCount divided by the number of orders created on the same day. This is a simplification — a return may reference an order from a different day.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
