# OmniumProductAlertSearchRequest

**Fields:**

- `id`: List<string>, nullable, max length 250 — Id of the ProductAlert object
- `skuId`: List<string>, nullable, max length 250 — SkuId of product
- `email`: List<string>, nullable, max length 250 — Email of the customer
- `phone`: List<string>, nullable, max length 250 — Phone number of the customer
- `warehouseCodes`: List<string>, nullable, max length 250 — WarehouseCodes to monitor
- `storeId`: List<string>, nullable, max length 250 — StoreId of the original request
- `storeName`: List<string>, nullable, max length 250 — StoreName of the original request
- `isActive`: boolean, nullable — ProductAlert is active
- `created`: string (date-time) — Date the ProductAlert was created
- `notificationSentDate`: string (date-time), nullable — Date the ProductAlert was sent
- `productAlertDeletedDate`: string (date-time), nullable — Date the ProductAlert was deleted
- `take`: integer (int32) — Number of productAlerts to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `referralStoreId`: List<string>, nullable, max length 250 — StoreIds of the stores whose staff registered the alert
- `source`: List<string>, nullable, max length 250 — Channels the alert was registered through
- `searchText`: string, nullable — Free text matched against email, phone, SkuId, product name and store names
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties to filter on. An empty Key matches the value across all properties.

**Used directly by endpoints in:**

- [Products | Alerts](../endpoints/products/alerts.md)
