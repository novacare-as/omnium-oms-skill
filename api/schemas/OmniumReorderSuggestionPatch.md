# OmniumReorderSuggestionPatch

Reorder suggestion patch model for partial updates. Only the values present in the request are updated.
Changes to fields involved in the calculation trigger a recalculation of the suggestion.

**Fields:**

- `skuId`: string, required — Product SKU / Code / Variant / ID. Required to identify the suggestion to patch.
- `warehouseCode`: string, required — Warehouse Code / ID. Required to identify the suggestion to patch.
- `boost`: number (decimal), nullable — Percentage added to the average daily sales before the suggestion is calculated. 0 = no boost, 50 = +50%, -30 = -30%. Allowed range is -90 to 900. The boost is one-time and is reset to 0 when the suggestion is released.
- `minQuantity`: number (decimal), nullable — Minimum inventory quantity (reorder point). Persisted to the inventory item.
- `maxQuantity`: number (decimal), nullable — Maximum inventory quantity (order-up-to level). Persisted to the inventory item.
- `reorderMinQuantity`: number (decimal), nullable — Minimum number of items to order. Persisted to the inventory item.
- `reorderQuantity`: number (decimal), nullable — Manual quantity override. When set, this is used instead of the calculated suggestion.
- `location`: string, nullable — Item (warehouse) location. Persisted to the inventory item.
- `averageDailyUsageFrom`: string (date-time), nullable — Start of the sales period used to calculate average daily sales. Changing the sales period re-fetches sales data in the background.
- `averageDailyUsageTo`: string (date-time), nullable — End of the sales period used to calculate average daily sales. Changing the sales period re-fetches sales data in the background.
- `fieldsToForceNull`: List<string>, nullable — Force nullable fields to null. Use the property path, e.g. "ReorderQuantity" or "Location".

**Used directly by endpoints in:**

- [Purchase Orders | Reorder Suggestions](../endpoints/purchase-orders/reorder-suggestions.md)
