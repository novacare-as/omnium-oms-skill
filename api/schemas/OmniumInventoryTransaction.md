# OmniumInventoryTransaction

Represents an inventory transaction in the public API

**Fields:**

- `id`: string, nullable — Unique identifier for the transaction
- `variant`: string, nullable — SKU/Variant identifier
- `transactionDate`: string (date-time) — Date and time of the transaction
- `warehouseCode`: string, nullable — Warehouse code where the transaction occurred
- `physicalWarehouseCode`: string, nullable — Physical warehouse code (for virtual warehouses)
- `isVirtual`: boolean, nullable — Indicates if this is a virtual warehouse transaction
- `relatedTransactionId`: string, nullable — Related transaction ID
- `warehouseName`: string, nullable — Name of the warehouse
- `inventoryChange`: number (decimal) — Change in inventory quantity
- `reservedInventoryChange`: number (decimal) — Change in reserved inventory quantity
- `newInventory`: number (decimal) — New inventory quantity after transaction
- `newReservedInventory`: number (decimal) — New reserved inventory quantity after transaction
- `orderId`: string, nullable — Associated order ID
- `returnOrderId`: string, nullable — Associated return order ID
- `purchaseOrderId`: string, nullable — Associated purchase order ID
- `inventoryCountItem`: string, nullable — Inventory count item identifier
- `goodsReceptionId`: string, nullable — Goods reception ID
- `userId`: string, nullable — User ID who performed the transaction
- `userName`: string, nullable — User name who performed the transaction
- `reason`: string, nullable — Reason for the transaction
- `reasonCode`: string, nullable — Inventory reason code given when the transaction was booked.
- `location`: string, nullable — Storage location
- `batchIndex`: string, nullable — Batch index
- `inventoryChangeValue`: number (decimal) — Value of the inventory change
- `totalInventoryValue`: number (decimal) — Total inventory value after transaction
- `transactionType`: string, nullable — Type of transaction
- `internalReference`: string, nullable — Internal reference
- `toLocation`: string, nullable — Destination location for location transfer transactions
