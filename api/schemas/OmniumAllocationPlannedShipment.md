# OmniumAllocationPlannedShipment

One shipment in a plan: a warehouse and the lines it sends.

**Fields:**

- `warehouseId`: string, nullable — The warehouse code to ship from
- `sourceShipmentId`: string, nullable — The shipment this replaces, when the order already had one
- `shippingMethodName`: string, nullable — The shipping method the plan chose, when it chose one
- `allowedShippingMethodNames`: List<string>, nullable, max length 100 — Shipping methods that can still be used from this warehouse
- `totalWeightKg`: number (double), nullable
- `distanceKm`: number (double), nullable
- `lines`: List<[`OmniumAllocationPlannedLine`](OmniumAllocationPlannedLine.md)>, nullable, max length 500
