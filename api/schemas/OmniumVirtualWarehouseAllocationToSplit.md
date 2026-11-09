# OmniumVirtualWarehouseAllocationToSplit

Virtual Warehouse Allocation identifier for split operations.
Use either Id or WarehouseCode to identify which allocation to split.

**Fields:**

- `id`: string, nullable — Unique Id of the allocation to split. If specified, takes priority over WarehouseCode.
- `quantity`: number (decimal) — Quantity to move from this allocation to the new line.
- `warehouseCode`: string, nullable — Warehouse code of the allocation to split. Used when Id is not specified.
