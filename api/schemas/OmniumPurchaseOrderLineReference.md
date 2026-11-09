# OmniumPurchaseOrderLineReference

Representing a line item for creating new delivery from purchase orders

**Fields:**

- `lineItemId`: string, nullable — Line item ID
- `quantity`: number (decimal) — Quantity
- `code`: string, nullable — Quantity
- `packageBarcode`: string, nullable — The Barcode of the kolli/package that contains this lineItem. Can be the same over multiple lineitems

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
