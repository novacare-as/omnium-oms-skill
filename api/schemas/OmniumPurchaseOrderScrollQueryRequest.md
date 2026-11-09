# OmniumPurchaseOrderScrollQueryRequest

Request model for the scroll purchase order Query endpoint (POST /api/PurchaseOrders/Query/Scroll).
Inherits all purchase order filter fields from Omnium.Public.PurchaseOrders.Query.OmniumPurchaseOrderQueryRequestBase;
adds scroll batch sizing.

Use this for bulk extraction — full syncs to other systems (ERP, BI), data exports. For
UI-style paginated queries, use Omnium.Public.PurchaseOrders.Query.OmniumPurchaseOrderQueryRequest with the regular
Query endpoint instead.

**Fields:**

- `scrollSize`: integer (int32), nullable — Number of items per scroll batch. Default applied when null: 500. Allowed range: 100–1000.
- `searchText`: string, nullable — Free-text search across purchase order fields (order number, supplier, reference number, etc.). Also matches the purchase order document ID exactly. Max 300 characters.
- `purchaseOrderIds`: List<string>, nullable, max length 250 — Filter by purchase order document IDs (exact match).
- `orderNumber`: string, nullable — Filter by purchase order number.
- `statuses`: List<string>, nullable, max length 250 — Filter by purchase order statuses.
- `storeIds`: List<string>, nullable, max length 250 — Filter by store IDs.
- `supplierId`: string, nullable — Filter by supplier ID.
- `supplierWarehouseCode`: string, nullable — Filter by supplier warehouse code (warehouse used for sending internal transfers).
- `email`: string, nullable — Filter by supplier email address.
- `orderType`: string, nullable — Filter by purchase order type (InternalTransfer or PurchaseOrder).
- `skuIds`: List<string>, nullable, max length 250 — Filter by SKU IDs on the order lines. Returns purchase orders containing at least one order line with a matching SKU.
- `externalIds`: List<string>, nullable, max length 250 — Filter by external IDs.
- `tags`: List<string>, nullable, max length 250 — Filter by tags. Returns purchase orders carrying at least one of the tags.
- `excludedTags`: List<string>, nullable, max length 250 — Exclude purchase orders carrying any of these tags.
- `deliveryIds`: List<string>, nullable, max length 250 — Filter by delivery IDs assigned to the order lines.
- `projectId`: string, nullable — Filter by project ID.
- `errorKeys`: List<string>, nullable, max length 250 — Filter by entity error keys. Returns purchase orders that have at least one error with a matching key.
- `hasDelivery`: boolean, nullable — Filter by whether the purchase order has at least one order line with a delivery assigned. True returns only purchase orders with a delivery on one or more lines; false returns only purchase orders with no deliveries on any line; null (default) returns both.
- `createdFrom`: string (date-time), nullable — Minimum creation date.
- `createdTo`: string (date-time), nullable — Maximum creation date.
- `modifiedFrom`: string (date-time), nullable — Minimum modified date. Use with Omnium.Public.PurchaseOrders.Query.OmniumPurchaseOrderQueryRequestBase.ModifiedTo for delta queries.
- `modifiedTo`: string (date-time), nullable — Maximum modified date.
- `requestedDeliveryDateFrom`: string (date-time), nullable — Minimum requested delivery date.
- `requestedDeliveryDateTo`: string (date-time), nullable — Maximum requested delivery date.
- `fields`: [`OmniumFieldSelection`](OmniumFieldSelection.md)
- `sort`: List<[`OmniumSortField`](OmniumSortField.md)>, nullable, max length 10 — Sort fields in priority order. Each entry specifies a field name and direction ("asc" or "desc"). Available field names are entity-specific (e.g. "price", "name", "modified" for products).

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
