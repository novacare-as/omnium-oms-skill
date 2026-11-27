# OmniumProductAlertRequest

**Fields:**

- `id`: string, nullable — ProductAlert ID (Will be set to Guid if not set)
- `skuId`: string, required — SkuID of the product to alert on
- `email`: string, nullable — Email address to send the alert to
- `phone`: string, nullable — Phone number to send the alert to
- `storeId`: string, nullable — StoreID of the store to monitor inventory for, if not set, will monitor all warehouses.
- `marketId`: string, nullable — MarketId determines language variant of the notification.
- `referralStoreId`: string, nullable — StoreID of the store whose staff registered the alert. Optional, and validated against an existing store. Unlike StoreId it does not affect which inventory is monitored.
- `source`: string, nullable — Channel the alert was registered through, for example "Webshop" or the name of an in-store app. Optional, free text.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom key/value properties to store on the alert. Replaces any existing properties when updating.

**Used directly by endpoints in:**

- [Products | Alerts](../endpoints/products/alerts.md)
