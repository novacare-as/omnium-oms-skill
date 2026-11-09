# OmniumInventoryItem

Inventory item for a specific SKU

**Fields:**

- `sku`: string, nullable — Primary identifier for the inventory item, should represent the product SKU / Code / Variant / ID
- `warehouseCode`: string, nullable — Warehouse Code / ID
- `physicalWarehouseCode`: string, nullable — Only in use with virtual stock locations in Omnium. Specifies the physical warehouse location of a virtual inventory item. NB! Must be null for all physical inventories.
- `isVirtual`: boolean, nullable — Only in use with virtual stock locations in Omnium. Indicates that this is a virtual inventory item - representing a virtual allocation of physical inventory located at the PhysicalWarehouse.
- `inventory`: number (decimal) — Number of items in stock
- `reservedInventory`: number (decimal) — Number of reserved items
- `calculatedInventory`: number (decimal) — Calculated inventory (used for packages where available inventory is calculated from components)
- `location`: string, nullable — Item (warehouse) location
- `atp`: List<[`OmniumInventoryAtp`](OmniumInventoryAtp.md)>, nullable, max length 250 — List of ATP values (future deliveries)
- `batches`: List<[`OmniumInventoryBatch`](OmniumInventoryBatch.md)>, nullable, max length 250 — Represents a collection of inventory batches associated with the item, ordered based on the First-In, First-Out (FIFO) principle. Note: FIFO must be enabled for this property to be relevant.
- `locationInventories`: List<[`OmniumLocationInventory`](OmniumLocationInventory.md)>, nullable, max length 250 — Location breakdown within the warehouse. Only populated when warehouse location management is enabled.
- `maxQuantity`: number (decimal) — Max inventory quantity
- `minQuantity`: number (decimal) — Minimum inventory quantity
- `disableReorderSuggestions`: boolean, nullable — When true, no reorder suggestions are generated for this inventory item (SKU/warehouse combination)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Customer properties, (key values)
- `created`: string (date-time) — Created date
- `modified`: string (date-time) — Modified date
- `reorderMinQuantity`: number (decimal) — Minimum number of items to order
- `cost`: number (decimal) — The cost price per unit for this inventory item
- `costTotal`: number (decimal), read-only — The current total cost value, calculated as Quantity * Cost.
- `costCurrency`: string, nullable — The currency of the cost price

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
