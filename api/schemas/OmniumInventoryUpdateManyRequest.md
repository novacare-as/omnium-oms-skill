# OmniumInventoryUpdateManyRequest

Request model for updating a range of inventory items with an optional reason and reason code

**Fields:**

- `inventoryItems`: List<[`OmniumInventoryItem`](OmniumInventoryItem.md)>, nullable — Inventory items to update
- `reasonCode`: string, nullable — Optional reason code for the update, stored as given as ReasonCode on the inventory transactions the update creates.
- `reason`: string, nullable — Optional free text describing the update. Stored as Reason on the inventory transactions the update creates.
- `transactionType`: string, nullable — Optional transaction type for the inventory transactions the update creates, stored as TransactionType. When omitted, null or empty it defaults to 'Manual'. Otherwise it must be one of: PurchaseOrder, SalesOrder, InventoryCount, Manual, API, AtpCreated, LocationTransfer, Transfer or Cancellation (case-insensitive). Any other value is rejected with 400.
- `isReservedInventoryOverwritten`: boolean — Set to 'true' if reserved inventory should be overwritten with the values in the request. Defaults to 'false'.

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
