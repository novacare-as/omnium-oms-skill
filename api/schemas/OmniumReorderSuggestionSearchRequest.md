# OmniumReorderSuggestionSearchRequest

Search and filtering of reorder suggestions

**Fields:**

- `page`: integer (int32) — Page number of the search results
- `take`: integer (int32) — Number of records to retrieve per page. Max is 100.
- `searchText`: string, nullable — Free text search on product name, SKU, EAN, brand and location
- `skuIds`: List<string>, nullable — Filter by SKUs
- `warehouseCodes`: List<string>, nullable — Filter by warehouse codes
- `supplierIds`: List<string>, nullable — Filter by supplier IDs
- `assortmentCodes`: List<string>, nullable — Filter by assortment codes
- `purchaseOrderIds`: List<string>, nullable — Filter by purchase order IDs
- `excludePurchaseOrders`: boolean, nullable — When true, only suggestions not connected to a purchase order are returned
- `hasSuggestions`: boolean, nullable — When true, only items with a suggested reorder quantity are returned. When false, only items without.
- `hasBoost`: boolean, nullable — When true, only suggestions with a boost are returned. When false, only suggestions without.

**Used directly by endpoints in:**

- [Purchase Orders | Reorder Suggestions](../endpoints/purchase-orders/reorder-suggestions.md)
