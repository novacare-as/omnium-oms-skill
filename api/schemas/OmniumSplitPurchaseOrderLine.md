# OmniumSplitPurchaseOrderLine

Request to split a purchase order line into two lines

**Fields:**

- `lineItemId`: string, nullable — The line item ID to split
- `quantityToSplit`: number (decimal) — Quantity to move to the new line. The remaining quantity stays on the original line.
- `virtualWarehouseAllocationsToSplit`: List<[`OmniumVirtualWarehouseAllocationToSplit`](OmniumVirtualWarehouseAllocationToSplit.md)>, nullable — Virtual warehouse allocations to move/split. If not specified, allocations will be split proportionally based on QuantityToSplit.
- `newLineItemId`: string, nullable — Optional: Specify a custom line item ID for the new line. If not provided, a new ID will be generated.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
