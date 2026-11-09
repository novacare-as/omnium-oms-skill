# OmniumLocationTransferRequest

Request model for transferring inventory between locations within a warehouse, or assigning unlocated stock to a location

**Fields:**

- `skuId`: string, nullable — Product SKU / Code / Variant / ID
- `warehouseCode`: string, nullable — Warehouse Code / ID
- `fromLocationCode`: string, nullable — Source location code. Null to assign from unlocated stock.
- `toLocationCode`: string, nullable — Destination location code
- `quantity`: number (decimal) — Quantity to transfer
- `setAsDefault`: boolean — If true, set the destination as the default location for this SKU

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
