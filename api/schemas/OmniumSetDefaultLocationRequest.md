# OmniumSetDefaultLocationRequest

Request model for setting the default location for a SKU in a warehouse

**Fields:**

- `skuId`: string, nullable — Product SKU / Code / Variant / ID
- `warehouseCode`: string, nullable — Warehouse Code / ID
- `locationCode`: string, nullable — Location code to set as default

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
