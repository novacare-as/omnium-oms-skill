# OmniumAllocationPlan

One way to serve the whole order: which warehouse sends which lines.

**Fields:**

- `planId`: string, nullable — Stable across runs for the same decision
- `shipments`: List<[`OmniumAllocationPlannedShipment`](OmniumAllocationPlannedShipment.md)>, nullable, max length 50
- `estimatedShippingCost`: number (decimal), nullable — Estimated internal shipping cost, when the options carry costs
- `totalDistanceKm`: number (double), nullable — Total distance from the sending warehouses to the destination
- `deliveryProbability`: number (decimal) — 0 to 1. How likely every shipment can actually be picked, given stock depth
- `isPartial`: boolean — True when the plan leaves some lines unplaced
- `shipmentCount`: integer (int32) — Number of shipments the plan creates
