# OmniumInventoryAtpUpdate

Model for updating ATP (Available-to-Promise) values on an inventory item

**Fields:**

- `skuId`: string, required — Primary identifier for the inventory item, should represent the product SKU / Code / Variant / ID
- `warehouseCode`: string, required — Warehouse Code / ID
- `virtualWarehouseCode`: string, nullable — Only in use with virtual stock locations in Omnium. Specifies the virtual warehouse location of a virtual inventory item.
- `atp`: List<[`OmniumInventoryAtp`](OmniumInventoryAtp.md)>, required, max length 250 — List of ATP (Available-to-Promise) entries to set on the inventory item

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
