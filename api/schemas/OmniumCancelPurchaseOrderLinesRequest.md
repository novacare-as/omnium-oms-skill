# OmniumCancelPurchaseOrderLinesRequest

Request to cancel multiple lines on a single purchase order in one call.

**Fields:**

- `lineItemIds`: List<string>, nullable — IDs of the purchase order lines to cancel. Each matched line has its remaining, undelivered quantity cancelled. IDs not found on the purchase order are ignored.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
