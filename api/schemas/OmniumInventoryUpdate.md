# OmniumInventoryUpdate

Model for modifying an inventory item in Omnium

**Fields:**

- `skuId`: string, nullable — Primary identifier for the inventory item, should represent the product SKU / Code / Variant / ID
- `warehouseCode`: string, nullable — Warehouse Code / ID
- `virtualWarehouseCode`: string, nullable — Only in use with virtual stock locations in Omnium. Specifies the virtual warehouse location of a virtual inventory item and will cause a reduction in both physical and virtual inventory levels for the sku. NB! Must be null for all physical inventories.
- `inventoryChange`: number (decimal) — The change in inventory level
- `adjustReservedInventory`: boolean — If true both the inventory and reserved inventory level will be updated with the specified change.
- `orderId`: string, nullable — The order Id of the order related with the change.
- `reason`: string, nullable — [Optional] Reason for inventory change
- `locationCode`: string, nullable — [Optional] Location code within the warehouse. When provided and warehouse location management is enabled, the inventory change is applied to both the warehouse total and the specified location. When null, only the warehouse total is updated.

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
