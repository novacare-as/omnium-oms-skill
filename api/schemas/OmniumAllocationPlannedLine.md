# OmniumAllocationPlannedLine

One order line placed at a warehouse.

**Fields:**

- `lineId`: string, nullable — The order line id
- `skuId`: string, nullable — The SKU
- `quantity`: number (decimal) — How much of the line this shipment carries
- `arrivesOn`: string (date-time), nullable — When the goods reach the warehouse, if they are not there yet
- `purchaseOrderId`: string, nullable — The purchase order the line waits for, if it waits for one
- `purchaseOrderLineId`: string, nullable — The purchase order line the quantity comes from
- `deliveryId`: string, nullable — The delivery within that purchase order
