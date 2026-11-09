# OmniumInventoryItemPatch

Inventory item patch model for partial updates. Only the values present in the request are updated.
Quantities (Inventory / ReservedInventory) are intentionally not patchable here - use the dedicated
delta (ProcessInventoryTransactions) or total (UpdateMany) endpoints for those.

**Fields:**

- `skuId`: string, required — Primary identifier for the inventory item, should represent the product SKU / Code / Variant / ID. Required to identify the item to patch.
- `warehouseCode`: string, required — Warehouse Code / ID. Required to identify the item to patch.
- `virtualWarehouseCode`: string, nullable — Only in use with virtual stock locations in Omnium. Specifies the virtual warehouse location of a virtual inventory item.
- `location`: string, nullable — Item (warehouse) location
- `cost`: number (decimal), nullable — The cost price per unit for this inventory item
- `costCurrency`: string, nullable — The currency of the cost price
- `minQuantity`: number (decimal), nullable — Minimum inventory quantity
- `maxQuantity`: number (decimal), nullable — Max inventory quantity
- `reorderMinQuantity`: number (decimal), nullable — Minimum number of items to order
- `disableReorderSuggestions`: boolean, nullable — When true, no reorder suggestions are generated for this inventory item (SKU/warehouse combination). Supports FieldsToForceNull.
- `calculatedInventory`: number (decimal), nullable — Calculated inventory (used for packages where available inventory is calculated from components)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Customer properties (key values)
- `keepExistingProperties`: boolean, nullable — Set to 'false' if you want to replace the whole 'Properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.
- `atp`: List<[`OmniumInventoryAtp`](OmniumInventoryAtp.md)>, nullable, max length 250 — List of ATP values (future deliveries). When provided, the existing ATP list is replaced.
- `fieldsToForceNull`: List<string>, nullable — Force nullable fields to null. Use the property path, e.g. "Location", "CostCurrency", "Properties" or "Atp".

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
