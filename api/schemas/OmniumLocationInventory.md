# OmniumLocationInventory

Represents inventory at a specific location within a warehouse

**Fields:**

- `locationCode`: string, nullable — Location code within the warehouse (e.g., "A-01-3")
- `quantity`: number (decimal) — Quantity of items at this location
- `isDefaultLocation`: boolean — Whether this is the default location for the SKU in this warehouse
