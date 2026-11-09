# OmniumPurchaseOrderForm

Purchase order form

**Fields:**

- `lineItems`: List<[`OmniumPurchaseOrderLine`](OmniumPurchaseOrderLine.md)>, nullable, max length 2500 — Order lines
- `total`: number (decimal) — Order total
- `totalExclTax`: number (decimal) — Order total ex tax
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
