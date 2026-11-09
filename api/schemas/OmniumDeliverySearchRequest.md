# OmniumDeliverySearchRequest

Search model for deliveries

**Fields:**

- `createdFrom`: string (date-time), nullable — Minimum creation date to filter the search results.
- `createdTo`: string (date-time), nullable — Maximum creation date to filter the search results.
- `estimatedTimeOfArrivalFrom`: string (date-time), nullable — Minimum expected delivery date to filter the search results.
- `estimatedTimeOfArrivalTo`: string (date-time), nullable — Maximum expected delivery date to filter the search results.
- `customerName`: string, nullable, **deprecated** — Customer name to search for.
- `email`: string, nullable, **deprecated** — Email address to search for.
- `purchaseOrderNumber`: string, nullable, **deprecated** — Purchase order number to search for.
- `selectedDeliveries`: List<string>, nullable, max length 250 — Selected delivery ID to filter the search results.
- `selectedStatuses`: List<string>, nullable, max length 250 — Selected statuses to filter the search results.
- `page`: integer (int32) — Page number of the search results.
- `take`: integer (int32) — Number of records to retrieve per page.
- `selectedStores`: List<string>, nullable, max length 250 — Selected store names to filter the search results.
- `sortOrder`: string, nullable — Sort order of the search results.
- `searchText`: string, nullable — Text to search for.
- `orderType`: string, nullable — Purchase order type (InternalTransfer or PurchaseOrder)
- `tags`: List<string>, nullable, max length 250 — Filter by tags
- `excludedTags`: List<string>, nullable, max length 250 — Filter by excluding tags
- `supplierIds`: List<string>, nullable — Filter by supplier IDs

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
