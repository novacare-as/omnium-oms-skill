# OmniumPurchaseOrderFormPatch

Purchase order form, containing line items for order

**Fields:**

- `lineItems`: List<[`OmniumPurchaseOrderLinePatch`](OmniumPurchaseOrderLinePatch.md)>, nullable, max length 1000 — All order lines
- `total`: number (decimal), nullable — Order total
- `totalExclTax`: number (decimal), nullable — Order total ex tax
