# OmniumInventoryTransactionSearchRequest

Contains all parameters for doing an inventory transaction search

**Fields:**

- `take`: integer (int32) — Number of items to take (page size), at most 2000. Left out, a page holds 2000 items. Only used together with Page.
- `page`: integer (int32) — Page number (starts from 1). Page multiplied by Take can be at most 20000, so use scrolling to reach items beyond that. Leave it out to fetch all items by scrolling: the first 2000 are returned, with a scroll id for the rest when there are more.
- `productId`: string, nullable — Filter by product ID
- `skuId`: string, nullable — Filter by SKU ID
- `purchaseOrderId`: string, nullable — Filter by purchase order ID
- `userId`: string, nullable — Filter by user ID
- `orderId`: string, nullable — Filter by order ID
- `warehouseCodes`: List<string>, nullable, max length 250 — Filter by warehouse codes
- `searchText`: string, nullable — Search text for general search
- `from`: string (date-time), nullable — Start date for transaction date range
- `to`: string (date-time), nullable — End date for transaction date range

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
