# OmniumInventoryAtp

Available to promise - Available quantities of the requested product, and delivery due dates.

**Fields:**

- `date`: string (date-time) — Expected delivery date
- `quantity`: number (decimal) — Quantity delivered
- `reservedQuantity`: number (decimal) — Reserved inventory on delivery
- `availableQuantity`: number (decimal), read-only — Quantity Available for sale
- `purchaseOrderId`: string, nullable — Purchase order ID origin of ATP value
- `deliveryId`: string, nullable — Delivery ID origin of ATP value
- `purchaseOrderLineId`: string, nullable — Purchase order line ID origin of ATP value
