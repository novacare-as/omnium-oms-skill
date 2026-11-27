# OmniumPurchaseOrderSearchRequest

Search model for purchase orders

**Fields:**

- `orderNumber`: string, nullable — Order number to search for.
- `email`: string, nullable — Email address to search for.
- `phone`: string, nullable — Phone number to search for.
- `searchText`: string, nullable — Text to search for.
- `selectedStatuses`: List<string>, nullable, max length 250 — Selected statuses to filter the search results.
- `supplierName`: string, nullable — Supplier name to search for.
- `supplierId`: string, nullable — Supplier ID to search for.
- `supplierWarehouseCode`: string, nullable — Supplier warehouse code (warehouse used for sending internal transfers)
- `orderType`: string, nullable — Purchase order type (InternalTransfer or PurchaseOrder)
- `createdFrom`: string (date-time), nullable — Minimum creation date to filter the search results.
- `createdTo`: string (date-time), nullable — Maximum creation date to filter the search results.
- `modifiedFrom`: string (date-time), nullable — Minimum modified date to filter the search results.
- `modifiedTo`: string (date-time), nullable — Maximum modified date to filter the search results.
- `requestedDeliveryDateFrom`: string (date-time), nullable — Minimum requested delivery date to filter the search results.
- `requestedDeliveryDateTo`: string (date-time), nullable — Maximum requested delivery date to filter the search results.
- `urgent`: boolean — Indicates whether the search should include urgent orders only.
- `selectedStores`: List<string>, nullable, max length 250 — Selected store names to filter the search results.
- `take`: integer (int32) — Number of records to retrieve per page.
- `page`: integer (int32) — Page number of the search results.
- `productNumbers`: List<string>, nullable, max length 250 — List of product numbers to filter the search results.
- `externalIds`: List<string>, nullable, max length 250 — Search purchase orders with external IDs
- `sortOrder`: string, nullable — Sort order of the search results.
- `tags`: List<string>, nullable, max length 250 — Filter by tags
- `excludedTags`: List<string>, nullable, max length 250 — Filter by excluding tags
- `hasDelivery`: boolean, nullable — Filter by whether the purchase order has at least one order line with a delivery assigned. True returns only purchase orders with a delivery on one or more lines; false returns only purchase orders with no deliveries on any line; null (default) returns both.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
