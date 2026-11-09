# OmniumIncreaseReservedInventoryRequest

Model for increasing reserved inventory on an inventory item. Only the reserved inventory level is changed - physical inventory is left untouched.

**Fields:**

- `skuId`: string, required — Primary identifier for the inventory item, should represent the product SKU / Code / Variant / ID
- `warehouseCode`: string, required — Warehouse Code / ID
- `virtualWarehouseCode`: string, nullable — Only in use with virtual stock locations in Omnium. Specifies the virtual warehouse location of a virtual inventory item.
- `quantity`: number (decimal) — The quantity to add to reserved inventory. Must be greater than zero.
- `orderId`: string, nullable — [Optional] The order Id related to the reservation.
- `purchaseOrderId`: string, nullable — [Optional] The purchase order Id related to the reservation.
- `transactionReference`: string, required — Idempotency key for this reservation. If a transaction with this reference already exists, the request is skipped instead of being applied again.
- `reason`: string, nullable — [Optional] Reason for the reservation, stored on the inventory transaction.

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
