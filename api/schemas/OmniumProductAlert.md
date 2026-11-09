# OmniumProductAlert

Class for product alert, for sending notifications to users when a product is back in stock

**Fields:**

- `id`: string, nullable — ProductAlert ID
- `skuId`: string, nullable — SkuID of the product to alert on
- `email`: string, nullable — Email address to send the alert to
- `phone`: string, nullable — Phone number to send the alert to
- `storeId`: string, nullable — StoreID of the store to monitor inventory for
- `warehouseCodes`: List<string>, nullable, max length 250 — WarehouseID of the warehouse to monitor inventory for
- `marketId`: string, nullable — MarketId determines language variant of the notification.
- `storeName`: string, nullable — Name of store to monitor inventory for
- `isActive`: boolean — Flag to indicate if the alert is active
- `created`: string (date-time) — ProductAlert creation date
- `notificationSentDate`: string (date-time), nullable — Date the ProductAlert notification was sent
- `productAlertDeletedDate`: string (date-time), nullable — Date the ProductAlert was deactivated
- `productName`: string, nullable — Name of product to alert on
- `referralStoreId`: string, nullable — StoreID of the store whose staff registered the alert. Does not affect which inventory is monitored.
- `referralStoreName`: string, nullable — Name of the store whose staff registered the alert
- `source`: string, nullable — Channel the alert was registered through, for example "Webshop" or the name of an in-store app
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom key/value properties on the alert
