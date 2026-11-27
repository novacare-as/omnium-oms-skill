# OmniumWarehouseInventory

**Fields:**

- `entryId`: string, nullable — Unique identificaton
- `warehouseCode`: string, nullable — Warehouse code
- `inStockQuantity`: number (decimal) — Number of items in stock
- `reservedQuantity`: number (decimal) — Number of items reserved
- `reorderMinQuantity`: number (decimal) — Minimum number of items to order
- `preorderQuantity`: number (decimal) — Preorder quantity
- `backorderQuantity`: number (decimal) — Backorder quantity
- `allowBackorder`: boolean — True if backorder is allowed
- `allowPreorder`: boolean — True of preorder is allowed
- `inventoryStatus`: string, nullable — Inventory status
- `preorderAvailabilityDate`: string (date-time), nullable — Date preorder is available
- `backorderAvailabilityDate`: string (date-time), nullable — Date backorder is available
